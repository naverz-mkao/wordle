export const KeyboardLetters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"]

export class Constants {
    static WORD_ROWS = 6;
    static WORD_LETTER_COUNT = 5;
}

export enum WordleState {
    NONE = 0,
    INIT = 1,
    PLAYING = 2,
    END_SUCCESS = 3,
    END_FAIL = 4,
}

export enum LetterState {
    NONE = 0,
    EXACT_MATCH = 1,
    IN_WORD_MATCH = 2,
}