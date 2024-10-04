# TypeScriptSdkExample-glTF-Converter
Example for using the ShapeDiver backend to convert CAD to glTF files.

## Usage

Install dependencies: 

```
npm i
```

Upload `glTF-Converter.ghx` to ShapeDiver. 

Enable backend access on the model edit page (tab ["Developers"](https://help.shapediver.com/doc/developers-settings)).

Copy `.env.template` to `.env`. 

Fill in your values for `MODEL_VIEW_URL` and `BACKEND_TICKET`. 

Run the tool: 

```
npm run cli -- glTF-Converter.3dm glTF-Converter.glb
```

This converts the input file `glTF-Converter.3dm` to the output binary glTF `glTF-Converter.glb`. 

## Reuse the code

If you want to plug this to your own codebase, copy the functionality from [src/convert.ts](src/convert.ts).

## Food for thought

  * Adapt `glTF-Converter.ghx` to include your specific conversion logic. Some hints: 
  * The [`glTF 2.0 Display`](https://help.shapediver.com/doc/gltf-2-0-display) component allows you to 
    * set materials, 
    * structure the scene tree, 
    * instance objects using transformations. 
  * The [Import Geometry](https://help.shapediver.com/doc/import-geometry) component supports lots of CAD file formats (all formats supported by Rhino).
  * You could filter objects based on their type, name, or user text. 
  * Instead of converting to glTF, you could convert to any other file format supported by the [Download Export](https://help.shapediver.com/doc/download-export) component. Essentially all CAD file formats supported by Rhino can be used. Using an export component instead of the display component requires the [convert](src/convert.ts) function to be slightly adapted. Ask us if you need this. 
  * The [Download Export](https://help.shapediver.com/doc/download-export) component also supports [zip files](https://help.shapediver.com/doc/download-export#DownloadExport-Exportmultiplefiles). 

## How to get support



