const { todo } = require('../../dev')
const operator = require('../../types/function/operator')
const list = require('../../types/list')

/** @typedef {{readonly kind: '{'}} LeftBraceToken */

/** @typedef {{readonly kind: '}'}} RightBraceToken */

/** @typedef {{readonly kind: ':'}} ColonToken */

/** @typedef {{readonly kind: ','}} CommaToken */

/** @typedef {{readonly kind: '['}} LeftBracketToken */

/** @typedef {{readonly kind: ']'}} RightBracketToken */

/** 
 * @typedef {{
 * readonly kind: 'string'
 * readonly value: string
 * }} StringToken 
 * */

/** 
 * @typedef {{
 * readonly kind: 'number'
 * readonly value: number
 * }} NumberToken 
 * */

/** @typedef {{readonly kind: 'true'}} TrueToken */

/** @typedef {{readonly kind: 'false'}} FalseToken */

/** @typedef {{readonly kind: 'null'}} NullToken */

/** @typedef {{readonly kind: 'error'}} ErrorToken */

/** 
 * @typedef {|
 * LeftBraceToken |
 * RightBraceToken |
 * ColonToken |
 * CommaToken |
 * LeftBracketToken |
 * RightBracketToken |
 * StringToken |
 * NumberToken |
 * TrueToken |
 * FalseToken |
 * NullToken |
 * ErrorToken |
 * undefined
 * } JsonToken
 */

const leftBrace = 0x7b;
const rightBrace = 0x7d;
const colon = 0x3a;
const comma = 0x2c;
const leftBracket = 0x5b;
const rightBracket = 0x5d;

const quotationMark = 0x22;
const digit0 = 0x30;
const digit1 = 0x31;
const digit2 = 0x32;
const digit3 = 0x33;
const digit4 = 0x34;
const digit5 = 0x35;
const digit6 = 0x36;
const digit7 = 0x37;
const digit8 = 0x38;
const digit9 = 0x39;
const signPlus = 0x2b;
const signMinus = 0x2d;

const letterF = 0x66;
const letterN = 0x6e;
const letterT = 0x74;

/** @type {LeftBraceToken} */
const leftBraceToken = {kind: '{'}

/** @type {RightBraceToken} */
const rightBraceToken = {kind: '}'}

/** @type {ColonToken} */
const colonToken = {kind: ':'}

/** @type {CommaToken} */
const commaToken = {kind: ','}

/** @type {LeftBracketToken} */
const leftBracketToken = {kind: '['}

/** @type {RightBracketToken} */
const rightBracketToken = {kind: ']'}

/** @typedef {(input: JsonCharacter) => readonly[JsonToken, TokenizerState]} TokenizerState */

/** @typedef {number|undefined} JsonCharacter */

/** @type {TokenizerState} */
const initialState = input => 
{
    switch(input)
    {
        case leftBrace: return [leftBraceToken, initialState]
        case rightBrace: return [rightBraceToken, initialState]
        case colon: return [colonToken, initialState]
        case comma: return [commaToken, initialState]
        case leftBracket: return [leftBracketToken, initialState]
        case rightBracket: return [rightBracketToken, initialState]
        case letterT: return todo()
        case letterF: return todo()
        case letterN: return todo()
        case quotationMark: return todo()
        case digit0: return todo()
        case digit1: 
        case digit2:
        case digit3:
        case digit4:
        case digit5:
        case digit6:
        case digit7:
        case digit8:
        case digit9: return todo()
        case signPlus:
        case signMinus: return todo()
        case undefined: return[undefined, eofState]
        default: return [{kind: 'error'}, initialState]
    }
}

/** @type {TokenizerState} */
const eofState = input => [{kind: 'error'}, eofState]

/** @type {operator.StateScan<JsonCharacter, TokenizerState, JsonToken>} */
const tokenizeOp = state => input => state(input)

/** @type {(input: list.List<JsonCharacter>) => list.List<JsonToken>} */
const tokenize = input => list.stateScan(tokenizeOp)(initialState)(input)

module.exports = {
    /** @readonly */
    tokenize,
}
