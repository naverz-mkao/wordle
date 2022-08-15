import { TextMeshPro, TextMeshProUGUI } from 'TMPro';
import { Debug, GameObject, Renderer, TextMesh, Texture2D, Vector3, Color } from 'UnityEngine';
import { Button, Text, Image } from 'UnityEngine.UI';
import { Constant } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Constants, WordleState } from './Data';
import Main from './Main'
import { KeyboardLetters } from './Data';
import WordleSlot from './WordleSlot';
import WordleKey from './WordleKey';
import * as UnityEngine from 'UnityEngine';

export default class WordleView extends ZepetoScriptBehaviour {
    public keyboardKeys:Button[];
    public slotTemplate:GameObject;
    public keyTemplate:GameObject;
    public keyTemplateLetter:TextMeshProUGUI;
    public deleteKey:Button;
    public submitKey:Button;
    public test:Button;

    public keysParentRow1:GameObject;
    public keysParentRow2:GameObject;
    public keysParentRow3:GameObject;

    public WordleSlots;
    public WordleKeys:WordleKey[];

    public WordRowTemplate:GameObject;

    public prevWordleState:WordleState;
    public curWordleState:WordleState;

    Update() {
        this.prevWordleState = this.curWordleState;
        this.curWordleState = Main.instance.wordleModel.state;

        this.CheckForWinState();
        this.CheckForFailState();
    }

    private CheckForWinState() {
        if (this.curWordleState === WordleState.END_SUCCESS && this.prevWordleState !== WordleState.END_SUCCESS) {
            Debug.LogError("You Just Won!!!!!");
            this.StartCoroutine(this.DoRoutine());
        }
    }

    private CheckForFailState() {
        if (this.curWordleState === WordleState.END_FAIL && this.prevWordleState !== WordleState.END_FAIL) {
            Debug.LogError("You Just Lost!!!!!");
            this.StartCoroutine(this.DoRoutine());
        }
    }

    private *DoRoutine() {
        while (true) {

            yield new UnityEngine.WaitForSeconds(1);

            Debug.LogError("Co Routine Run");

            this.StopAllCoroutines();

            Main.instance.wordleModel.SetDefaults();
            this.ResetWordleSlots();
        }
    }

    private ResetWordleSlots() {
        for (let col = 0; col < Constants.WORD_ROWS; col++) {
            for (let row = 0; row < Constants.WORD_LETTER_COUNT; row++) {
                this.WordleSlots[col][row].Text.text = "";
                this.WordleSlots[col][row].Image.color = Color.cyan;
            }
        }

        for (let i = 0; i < this.WordleKeys.length; i++) {
            this.WordleKeys[i].Image.color = Color.cyan;
            this.WordleKeys[i].HasExactMatch = false;
        }
    }

    Start() {
        this.WordleKeys = [];
        this.prevWordleState = WordleState.NONE;
        this.curWordleState = WordleState.NONE;

        this.WordleSlots = [];

        const wordRows:[] = Main.instance.wordleModel.wordleArray;

        for (let row = 0; row < wordRows.length; row++) {

            const word:string[] = Main.instance.wordleModel.wordleArray[row];

            let wordSlots:WordleSlot[] = [];
            const myGO:GameObject = GameObject.Instantiate(this.WordRowTemplate) as GameObject;
            myGO.transform.SetParent(this.WordRowTemplate.transform.parent.transform);
            myGO.transform.localScale = new Vector3(1,1,1);
            myGO.SetActive(true);

            for (let col = 0; col < word.length; col++) {
                const mySlot:GameObject = GameObject.Instantiate(this.slotTemplate) as GameObject;
                mySlot.transform.SetParent(myGO.transform);
                mySlot.transform.localScale = new Vector3(1,1,1);
                mySlot.SetActive(true);
                let mySlotScript:WordleSlot = mySlot.GetComponent<WordleSlot>();
                mySlotScript.Text.text = Main.instance.wordleModel.wordleArray[row][col];
                wordSlots.push(mySlotScript);
            }
            this.WordleSlots.push(wordSlots);
        }

        for (let i = 0; i < 10; i++) {
            this.keyTemplateLetter.text = KeyboardLetters[i];
            const myGO:GameObject = GameObject.Instantiate(this.keyTemplate) as GameObject;
            myGO.transform.SetParent(this.keysParentRow1.transform);
            myGO.transform.localScale = new Vector3(1,1,1)
            myGO.SetActive(true);
            const wordleKey:WordleKey = myGO.GetComponent<WordleKey>();
            this.WordleKeys.push(wordleKey);
            myGO.GetComponent<Button>().onClick.AddListener(()=>{this.ClickOnKeyboard(KeyboardLetters[i]);});
        }

        for (let i = 10; i < 19; i++) {
            this.keyTemplateLetter.text = KeyboardLetters[i];
            const myGO:GameObject = GameObject.Instantiate(this.keyTemplate) as GameObject;
            myGO.transform.SetParent(this.keysParentRow2.transform);
            myGO.transform.localScale = new Vector3(1,1,1)
            myGO.SetActive(true);
            const wordleKey:WordleKey = myGO.GetComponent<WordleKey>();
            this.WordleKeys.push(wordleKey);
            myGO.GetComponent<Button>().onClick.AddListener(()=>{this.ClickOnKeyboard(KeyboardLetters[i]);});
        }

        for (let i = 19; i < 27; i++) {
            this.keyTemplateLetter.text = KeyboardLetters[i];
            const myGO:GameObject = GameObject.Instantiate(this.keyTemplate) as GameObject;
            myGO.transform.SetParent(this.keysParentRow3.transform);
            myGO.transform.localScale = new Vector3(1,1,1)
            myGO.SetActive(true);
            const wordleKey:WordleKey = myGO.GetComponent<WordleKey>();
            this.WordleKeys.push(wordleKey);
            myGO.GetComponent<Button>().onClick.AddListener(()=>{this.ClickOnKeyboard(KeyboardLetters[i]);});
        }

        this.ResetWordleSlots();

        this.deleteKey.onClick.AddListener(()=>{this.Delete()});
        this.submitKey.onClick.AddListener(()=>{this.Submit()});

        this.slotTemplate.SetActive(false);
    }

    private ClickOnKeyboard(key:string) {
        const rowIndex = Main.instance.wordleModel.currentWordRowIndex;
        const colIndex = Main.instance.wordleModel.currentWordColIndex;

        Main.instance.wordleModel.LetterEntered(key);

        if (colIndex < Constants.WORD_LETTER_COUNT) {
            this.WordleSlots[rowIndex][colIndex].Text.text = Main.instance.wordleModel.wordleArray[rowIndex][colIndex];
        }
    }

    private Delete() {
        if (Main.instance.wordleModel.state === WordleState.END_SUCCESS || Main.instance.wordleModel.state === WordleState.END_FAIL) return;

        const rowIndex = Main.instance.wordleModel.currentWordRowIndex;
        const colIndex = Main.instance.wordleModel.currentWordColIndex;

        Main.instance.wordleModel.Delete()

        if (colIndex > 0) {
            this.WordleSlots[rowIndex][colIndex - 1].Text.text = "";
        }
    }

    private Submit() {
        if (Main.instance.wordleModel.state === WordleState.END_SUCCESS || Main.instance.wordleModel.state === WordleState.END_FAIL) return;

        const rowIndex = Main.instance.wordleModel.currentWordRowIndex;
        const colIndex = Main.instance.wordleModel.currentWordColIndex;

        let wordToEval:string = "";
        let isMissingLetters = false;

        for (let i = 0; i < Constants.WORD_LETTER_COUNT; i++) {
            Debug.LogError(Main.instance.wordleModel.wordleArray[rowIndex][i]);
            wordToEval += Main.instance.wordleModel.wordleArray[rowIndex][i];
            if (Main.instance.wordleModel.wordleArray[rowIndex][i] === "") {

                isMissingLetters = true;
            }
        }

        if (isMissingLetters === true) {
            Debug.LogError("can not submit incomplete word!!!");
            return;
        } else {
            Debug.LogError(wordToEval);
        }

        if (Main.instance.wordleModel.TrySubmit()) {
            this.ColorWordBlocks(rowIndex);
            //this.ColorKeys();
        }
    }

    private ColorWordBlocks(rowIndex:number) {
        const wordToCompare:string = Main.instance.wordleModel.WordToMatch;

        for (let i = 0; i < Constants.WORD_LETTER_COUNT; i++) {

            const letter:string = this.WordleSlots[rowIndex][i].Text.text;
            if (letter.toLowerCase() === wordToCompare[i]) {
                Debug.LogError("match");
                this.WordleSlots[rowIndex][i].Image.color = Color.green;

                for (let j = 0; j < this.WordleKeys.length; j++) {
                    if (this.WordleKeys[j].Text.text.toLowerCase() === letter.toLowerCase()) {
                        this.WordleKeys[j].Image.color = Color.green;
                        this.WordleKeys[j].HasExactMatch = true;
                    }
                }

            } else if (wordToCompare.includes(letter.toLowerCase())) {
                this.WordleSlots[rowIndex][i].Image.color = Color.yellow;

                for (let j = 0; j < this.WordleKeys.length; j++) {
                    if (this.WordleKeys[j].Text.text.toLowerCase() === letter.toLowerCase()) {
                        Debug.LogError(this.WordleKeys[j].Image.color);
                        if (this.WordleKeys[j].HasExactMatch != true) {
                            this.WordleKeys[j].Image.color = Color.yellow;
                        }
                    }
                }

            } else {
                this.WordleSlots[rowIndex][i].Image.color = Color.gray;

                for (let j = 0; j < this.WordleKeys.length; j++) {
                    if (this.WordleKeys[j].Text.text.toLowerCase() === letter.toLowerCase()) {
                        this.WordleKeys[j].Image.color = Color.grey;
                    }
                }
            }

        }
    }
}