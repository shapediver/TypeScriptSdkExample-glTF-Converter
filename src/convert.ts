import {
    Configuration,
    FileApi,
    ResOutput,
    SessionApi,
    UtilsApi,
} from '@shapediver/sdk.geometry-api-sdk-v2';
import { guessMimeTypeFromFilename } from '@shapediver/viewer.utils.mime-type';
import * as fs from 'fs/promises';

interface ConvertOptions {
    /** Path to CAD file */
    filepathIn: string;
    /** Path to output glTF file */
    filepathOut: string;
    /** ShapeDiver model view URL for the glTF converter model */
    modelViewUrl: string;
    /** ShapeDiver backend ticket for the glTF converter model */
    ticket: string;
}

/**
 * Convert a CAD file to glTF using ShapeDiver
 * See the Grasshopper file in the root folder.
 * @param options
 */
export async function convert(options: ConvertOptions): Promise<void> {
    const { filepathIn, filepathOut, modelViewUrl, ticket } = options;

    // guess mime type of file
    const mimeTypes = guessMimeTypeFromFilename(filepathIn);
    if (mimeTypes.length === 0) {
        throw new Error(`Could not determine mime type of file ${filepathIn}`);
    }
    const mimeType = mimeTypes[0];

    // create configuration object for SDK
    const config = new Configuration({ basePath: modelViewUrl });

    // create session
    const sessionDto = (await new SessionApi(config).createSessionByTicket(ticket)).data;
    const sessionId = sessionDto.sessionId;

    // get parameter of type "File"
    const fileParam = Object.values(sessionDto.parameters!).find(
        (p) => p.type === 'File' && p.format!.includes(mimeType)
    );
    if (!fileParam) {
        throw new Error(`Could not find file parameter that supports mime type ${mimeType}`);
    }

    // read file from disk (filepath)
    const fileContents = await fs.readFile(filepathIn);
    const fileSize = Buffer.byteLength(fileContents);

    // request upload url
    const uploadResponse = await new FileApi(config).uploadFile(sessionId, {
        [fileParam.id]: { format: mimeType, size: fileSize },
    });
    const uploadDto = uploadResponse.data.asset.file![fileParam.id];

    // upload file to url
    await new UtilsApi().uploadAsset(uploadDto.href, fileContents, uploadDto.headers);

    // run computation
    const computationResponse = await new UtilsApi(config).submitAndWaitForOutput(sessionId, {
        [fileParam.id]: uploadDto.id,
    });

    // get resulting glTF url
    const outputResult = Object.values(computationResponse.outputs!).find((o) => {
        const output = o as ResOutput;
        return (
            output.status_computation === 'success' &&
            output.content!.some((c) => c.contentType === 'model/gltf-binary')
        );
    }) as ResOutput;
    if (!outputResult) {
        console.debug(JSON.stringify(computationResponse.outputs, null, 2));
        throw new Error('No resulting glTF file found');
    }
    const item = outputResult.content!.find((c) => c.contentType === 'model/gltf-binary');

    // download glTF file into buffer
    const gltf = (await new UtilsApi().download(item!.href!, { responseType: 'arraybuffer' }))
        .data as unknown as Buffer;

    // Write buffer to file at filepathOut
    await fs.writeFile(filepathOut, new DataView(gltf.buffer, gltf.byteOffset, gltf.byteLength));

    // close session
    await new SessionApi(config).closeSession(sessionId);
}
