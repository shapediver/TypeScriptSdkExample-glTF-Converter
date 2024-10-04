# TypeScriptSdkExample-glTF-Converter
Example for using the ShapeDiver backend to convert CAD to glTF files.

## Usage

Install dependencies: 

```
npm i
```

Upload `glTF-Converter.ghx` to ShapeDiver. 

Enable backend access on the model edit page (tab "Developers").

Copy `.env.template` to `.env`. 

Fill in your values for `MODEL_VIEW_URL` and `BACKEND_TICKET`. 

Run the tool: 

```
npm run cli -- glTF-Converter.3dm glTF-Converter.glb
```

This converts the input file `glTF-Converter.3dm` to the output binary glTF `glTF-Converter.glb`. 

## Reuse the code

If you want to plug this to your own codebase, copy the functionality from [src/convert.ts](src/convert.ts).
