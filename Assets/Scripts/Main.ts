import { Debug, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import WordleModel from './WordleModel'
import WordleView from './WordleView';

export default class Main extends ZepetoScriptBehaviour {
    static instance:Main;

    public wordleModel:WordleModel;

    Awake() {   
        Main.instance = this; 
        this.wordleModel = new WordleModel();
        this.wordleModel.Init();
    }

}