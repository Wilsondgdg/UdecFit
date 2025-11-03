import React from "react";
import renderer, { act } from "react-test-renderer";
import AdminPanel from "../src/screens/AdminPanel";
import { Alert, TextInput, Button, TouchableOpacity, Text } from "react-native";

jest.mock("../firebase/config", () => ({
    db: {},
    auth: {},
}));

const addDocMock = jest.fn();
const deleteDocMock = jest.fn();
const updateDocMock = jest.fn();
const collectionMock = jest.fn();
const onSnapshotMock = jest.fn();
const docMock = jest.fn();

jest.mock("firebase/firestore", () => ({
    collection: (...args: any[]) => collectionMock(...args),
    addDoc: (...args: any[]) => addDocMock(...args),
    onSnapshot: (...args: any[]) => onSnapshotMock(...args),
    deleteDoc: (...args: any[]) => deleteDocMock(...args),
    doc: (...args: any[]) => docMock(...args),
    updateDoc: (...args: any[]) => updateDocMock(...args),
}));

const signOutMock = jest.fn();
jest.mock("firebase/auth", () => ({
    signOut: (...args: any[]) => signOutMock(...args),
}));

// mock global fetch
global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    // default onSnapshot to immediately provide one machine
    onSnapshotMock.mockImplementation((_col: any, cb: any) => {
        const snapshot = {
            docs: [
                {
                    id: "m1",
                    data: () => ({ nombre: "Cinta 1", estado: "activa" }),
                },
            ],
        };
        // call callback synchronously as firestore would on mount
        cb(snapshot);
        // return unsubscribe function
        return jest.fn();
    });

    collectionMock.mockReturnValue({}); // not used directly in tests
    docMock.mockImplementation((db: any, col: string, id: string) => ({ db, col, id }));

    // default fetch resolves ok
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
});

function findText(root: renderer.ReactTestInstance, text: string) {
    const texts = root.findAllByType(Text);
    return texts.find((t) => {
        const ch = t.props.children;
        if (typeof ch === "string") return ch.includes(text);
        if (Array.isArray(ch)) return ch.join("").includes(text);
        return false;
    });
}

test("renders machines from onSnapshot and shows count", () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
        tree = renderer.create(<AdminPanel navigation={{ replace: jest.fn() }} />);
    });
    const root = tree!.root;
    const listHeader = findText(root, "Máquinas registradas (1)");
    expect(listHeader).toBeTruthy();

    const machineName = findText(root, "Cinta 1");
    expect(machineName).toBeTruthy();
});

test("agregarMaquina calls addDoc and clears input", async () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
        tree = renderer.create(<AdminPanel navigation={{ replace: jest.fn() }} />);
    });
    const root = tree!.root;

    const input = root.findByType(TextInput);
    // simulate typing
    act(() => {
        input.props.onChangeText("Nueva Maquina");
    });

    // find add button by title prop
    const addButton = root.findAllByType(Button).find((b) => b.props.title?.includes("➕ Agregar Máquina"));
    expect(addButton).toBeTruthy();

    await act(async () => {
        await addButton!.props.onPress();
    });

    expect(addDocMock).toHaveBeenCalled();
    // after adding, TextInput value should be cleared
    const updatedInput = root.findByType(TextInput);
    expect(updatedInput.props.value).toBe("");
});

test("eliminarMaquina calls deleteDoc and marcarMantenimiento calls updateDoc", async () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
        tree = renderer.create(<AdminPanel navigation={{ replace: jest.fn() }} />);
    });
    const root = tree!.root;

    // find the "Eliminar" button for the first machine
    const eliminarBtn = root.findAllByType(Button).find((b) => b.props.title === "Eliminar");
    expect(eliminarBtn).toBeTruthy();
    await act(async () => {
        await eliminarBtn!.props.onPress();
    });
    expect(deleteDocMock).toHaveBeenCalled();

    // find the toggle maintenance button (title 'Mantenimiento' because initial estado is 'activa')
    const maintBtn = root.findAllByType(Button).find((b) => b.props.title === "Mantenimiento");
    expect(maintBtn).toBeTruthy();
    await act(async () => {
        await maintBtn!.props.onPress();
    });
    expect(updateDocMock).toHaveBeenCalled();
});

test("handleBackup triggers fetch after confirming Alert.alert", async () => {
    // mock Alert.alert to simulate pressing the "Crear Copia" option
    const originalAlert = Alert.alert;
    (Alert.alert as any) = jest.fn((title: string, msg: string, buttons: any[]) => {
        // call the "Crear Copia" button (assumed to be at index 1)
        const createBtn = buttons && buttons.find((b: any) => b.text && b.text.includes("Crear Copia"));
        if (createBtn && createBtn.onPress) {
            // execute onPress which performs async fetch
            createBtn.onPress();
        }
    });

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
        tree = renderer.create(<AdminPanel navigation={{ replace: jest.fn() }} />);
    });
    const root = tree!.root;

    // find first TouchableOpacity (Crear Copia)
    const touchables = root.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThanOrEqual(1);

    await act(async () => {
        // call the onPress for first backup button
        await touchables[0].props.onPress();
    });

    expect(global.fetch).toHaveBeenCalledWith(
        "https://us-central1-udecfit-b6d1f.cloudfunctions.net/crearBackup"
    );

    // restore Alert
    (Alert.alert as any) = originalAlert;
});

test("handleRestore triggers fetch with provided folder name via Alert.prompt", async () => {
    // mock Alert.prompt to simulate user entering folder name and pressing "Restaurar"
    const originalPrompt = (Alert as any).prompt;
    (Alert as any).prompt = jest.fn((_title: any, _msg: any, buttons: any[]) => {
        const restoreBtn = buttons && buttons.find((b: any) => b.text && b.text.includes("Restaurar"));
        if (restoreBtn && restoreBtn.onPress) {
            // simulate entering folderName value
            restoreBtn.onPress("2023-10-26T14-30-00");
        }
    });

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
        tree = renderer.create(<AdminPanel navigation={{ replace: jest.fn() }} />);
    });
    const root = tree!.root;

    // second TouchableOpacity is the restore button (index 1)
    const touchables = root.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThanOrEqual(2);

    await act(async () => {
        await touchables[1].props.onPress();
    });

    expect(global.fetch).toHaveBeenCalledWith(
        "https://us-central1-udecfit-b6d1f.cloudfunctions.net/restaurarBackup?carpeta=2023-10-26T14-30-00"
    );

    (Alert as any).prompt = originalPrompt;
});

test("cerrarSesion calls signOut and navigation.replace", async () => {
    const replaceMock = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
        tree = renderer.create(<AdminPanel navigation={{ replace: replaceMock }} />);
    });
    const root = tree!.root;

    // find the logout button by title
    const logoutBtn = root.findAllByType(Button).find((b) => b.props.title?.includes("Cerrar Sesión"));
    expect(logoutBtn).toBeTruthy();

    await act(async () => {
        await logoutBtn!.props.onPress();
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(replaceMock).toHaveBeenCalledWith("Login");
});