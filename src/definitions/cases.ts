/**
 * Implementation taken from https://github.com/sindresorhus/type-fest, thanks to the following authors.
 *
 * busches: https://github.com/busches
 * chentsulin: https://github.com/chentsulin
 * g-plane: https://github.com/g-plane
 * jonahsnider: https://github.com/jonahsnider
 * JonghwanWon: https://github.com/JonghwanWon
 * Menecats: https://github.com/Menecats
 * sdotson: https://github.com/sdotson
 * sindresorhus: https://github.com/sindresorhus
 * skarab42: https://github.com/skarab42
 * szmarczak: https://github.com/szmarczak
 * Yash-Singh1: https://github.com/Yash-Singh1
 * zorji: https://github.com/zorji
 */
/** */

export type CamelCase<Type, Options extends CamelCaseOptions = { preserveConsecutiveUppercase: true }> = Type extends string
  ? Uncapitalize<CamelCaseFromArray<SplitWords<Type extends Uppercase<Type> ? Lowercase<Type> : Type>, Options>>
  : Type

export type DelimiterCase<Value, Delimiter extends string> = string extends Value
  ? Value
  : Value extends string
  ? StringArrayToDelimiterCase<SplitIncludingDelimiters<Value, WordSeparators | UpperCaseCharacters>, true, WordSeparators, UpperCaseCharacters, Delimiter>
  : Value

export type KebabCase<Value> = DelimiterCase<Value, '-'>
export type PascalCase<Value> = CamelCase<Value> extends string ? Capitalize<CamelCase<Value>> : CamelCase<Value>
export type ScreamingSnakeCase<Value> = Value extends string ? (IsScreamingSnakeCase<Value> extends true ? Value : Uppercase<SnakeCase<Value>>) : Value
export type SnakeCase<Value> = DelimiterCase<Value, '_'>

type CamelCaseOptions = {
  /**
  Whether to preserved consecutive uppercase letter.
  @default true
  */
  preserveConsecutiveUppercase?: boolean
}

type CamelCaseFromArray<Words extends string[], Options extends CamelCaseOptions, OutputString extends string = ''> = Words extends [
  infer FirstWord extends string,
  ...infer RemainingWords extends string[]
]
  ? Options['preserveConsecutiveUppercase'] extends true
    ? `${Capitalize<FirstWord>}${CamelCaseFromArray<RemainingWords, Options>}`
    : `${Capitalize<Lowercase<FirstWord>>}${CamelCaseFromArray<RemainingWords, Options>}`
  : OutputString

type Includes<Value extends readonly any[], Item> = Value extends readonly [Value[0], ...infer rest]
  ? IsEqual<Value[0], Item> extends true
    ? true
    : Includes<rest, Item>
  : false

type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false
type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false
type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false
type IsNumeric<T extends string> = T extends `${number}` ? true : false

type IsScreamingSnakeCase<Value extends string> = Value extends Uppercase<Value>
  ? Includes<SplitIncludingDelimiters<Lowercase<Value>, '_'>, '_'> extends true
    ? true
    : false
  : false

type RemoveLastCharacter<Sentence extends string, Character extends string> = Sentence extends `${infer LeftSide}${Character}` ? SkipEmptyWord<LeftSide> : never

type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word]

type SplitWords<
  Sentence extends string,
  LastCharacter extends string = '',
  CurrentWord extends string = ''
> = Sentence extends `${infer FirstCharacter}${infer RemainingCharacters}`
  ? FirstCharacter extends WordSeparators
    ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, LastCharacter>]
    : LastCharacter extends ''
    ? SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>
    : [false, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
    ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
    : [true, false] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
    ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
    : [true, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
    ? SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
    : [true, true] extends [IsLowerCase<LastCharacter>, IsUpperCase<FirstCharacter>]
    ? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
    : [true, true] extends [IsUpperCase<LastCharacter>, IsLowerCase<FirstCharacter>]
    ? [...RemoveLastCharacter<CurrentWord, LastCharacter>, ...SplitWords<RemainingCharacters, FirstCharacter, `${LastCharacter}${FirstCharacter}`>]
    : SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
  : [...SkipEmptyWord<CurrentWord>]

type SplitIncludingDelimiters_<Source extends string, Delimiter extends string> = Source extends ''
  ? []
  : Source extends `${infer FirstPart}${Delimiter}${infer SecondPart}`
  ? Source extends `${FirstPart}${infer UsedDelimiter}${SecondPart}`
    ? UsedDelimiter extends Delimiter
      ? Source extends `${infer FirstPart}${UsedDelimiter}${infer SecondPart}`
        ? [...SplitIncludingDelimiters<FirstPart, Delimiter>, UsedDelimiter, ...SplitIncludingDelimiters<SecondPart, Delimiter>]
        : never
      : never
    : never
  : [Source]

type SplitIncludingDelimiters<Source extends string, Delimiter extends string> = SplitIncludingDelimiters_<UpperCaseToLowerCase<Source>, Delimiter>

type StringPartToDelimiterCase<
  StringPart extends string,
  Start extends boolean,
  UsedWordSeparators extends string,
  UsedUpperCaseCharacters extends string,
  Delimiter extends string
> = StringPart extends UsedWordSeparators
  ? Delimiter
  : Start extends true
  ? Lowercase<StringPart>
  : StringPart extends UsedUpperCaseCharacters
  ? `${Delimiter}${Lowercase<StringPart>}`
  : StringPart

type StringArrayToDelimiterCase<
  Parts extends readonly any[],
  Start extends boolean,
  UsedWordSeparators extends string,
  UsedUpperCaseCharacters extends string,
  Delimiter extends string
> = Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
  ? `${StringPartToDelimiterCase<FirstPart, Start, UsedWordSeparators, UsedUpperCaseCharacters, Delimiter>}${StringArrayToDelimiterCase<
      RemainingParts,
      false,
      UsedWordSeparators,
      UsedUpperCaseCharacters,
      Delimiter
    >}`
  : Parts extends [string]
  ? string
  : ''

type UpperCaseCharacters =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

type UpperCaseToLowerCase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T

type WordSeparators = '-' | '_' | ' '
