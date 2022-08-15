import { TextMeshProUGUI } from 'TMPro';
import { Button, Image } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from 'UnityEngine';

export default class WordleKey extends ZepetoScriptBehaviour {
    public Button:Button;
    public Text:TextMeshProUGUI;
    public Image:Image;
    public HasExactMatch:boolean;

    Start() {    
        this.HasExactMatch = false;
    }

}