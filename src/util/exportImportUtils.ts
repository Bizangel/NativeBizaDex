import { usePersistentStorage } from "../localstore/storage";
import * as RNFS from '@dr.pogodin/react-native-fs';
import Share from "react-native-share"
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker"
import { Alert } from "react-native"

// In the future I'd like to handle this better with deep links with custom-made components
// For now I'm just using these slightly overkill libraries.
// Additionally the process, can be bit tedious.
const exportedFilename = "exportedPokedata.json.txt" // android seems to like txt files better

export async function exportStoredDataViaShare() {
  try {

    // Get the app's files directory path
    const filePath = `${RNFS.DocumentDirectoryPath}/${exportedFilename}`;

    // serializeStored data
    const serializedStore = JSON.stringify(usePersistentStorage.getState());

    // Write the text content to the file
    await RNFS.writeFile(filePath, serializedStore, 'utf8');

    // Share the file using react-native-share
    await Share.open({
      url: `file://${filePath}`,
      type: 'text/plain',
      subject: 'Export Stored PokeData file',
    });
  } catch (error) {
    // console.error('Error sharing file:', error);
  }
}


const equalSets = <T>(xs: Set<T>, ys: Set<T>) =>
  xs.size === ys.size &&
  [...xs].every((x) => ys.has(x));

export async function importStoredDataFromFile() {
  let pickerResult: DocumentPickerResponse;
  try {
    pickerResult = await DocumentPicker.pickSingle({ type: DocumentPicker.types.plainText })
  }
  catch (err) {
    return;
  }

  try {
    const fileContents = await RNFS.readFile(pickerResult.uri, "utf8")

    const currentStorage = usePersistentStorage.getState();
    const parsedToStore = JSON.parse(fileContents);

    const validKeysParsed = equalSets(new Set(Object.keys(parsedToStore)), new Set(Object.keys(JSON.parse(JSON.stringify(currentStorage)))))
    if (!validKeysParsed)
      throw new Error("Invalid file")


    const pokedexNames = parsedToStore.allStoredPokedexes.map((e: any) => e.pokedexName);

    Alert.alert('Import Data Confirmation',
      `Found the following pokedexes: \n\n${pokedexNames.slice(0, 5).join("\n")}\n${pokedexNames.length > 5 ? "..." : ""}\n
      Are you sure you want to import the data, this will override any local data and will be PERMANENTLY deleted.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Import',
          style: 'cancel',
          onPress: () => { usePersistentStorage.setState(parsedToStore) }
        },
      ], { cancelable: true })
  } catch (err) {
    Alert.alert('Invalid File', "Invalid or corrupted file given, unable to read contents.")
    return false;
  }
}