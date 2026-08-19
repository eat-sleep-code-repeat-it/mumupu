# About the Spec

This project is centered on the `番茄简谱脚本` (Tomato Jianpu Script), a text-based notation format for writing and rendering Chinese simplified notation music.

## What the spec is for

The specification defines how a music score can be represented as plain text in a file with the `.jps` extension. Instead of using a graphical score editor, users can write a script that describes:

- the title and metadata of the song
- the key, time signature, and tempo
- the melody and lyrics
- musical symbols such as rests, notes, slurs, repeats, dynamics, and multi-part structure

The goal is to make notation fast to type, easy to edit, and easy to render into high-quality sheet music images or MIDI/audio output.

## Structure of a JPS file

A complete `.jps` file is made of two parts:

1. Header / description block
   - Usually placed at the top
   - Uses uppercase identifiers such as:
     - `V`: version
     - `B`: title
     - `Z`: author
     - `D`: key signature
     - `P`: time signature
     - `J`: tempo or beat description
     - `X`: index/number
   - Lines beginning with `#` are comments and are ignored by the renderer.

2. Main musical body
   - Each line describes one line of music
   - `Q:` means a melody line
   - `C:` means lyric line
   - A melody line can have multiple lyric lines attached underneath it

## How the music is encoded

The spec defines a large set of symbols for the notation system:

- Notes use digits `1` to `7`
- Rest is `0`
- Hidden rest is `8`
- Rhythm note is `9`
- `-` is used for extended duration
- `/` is a reduced-time or division mark
- `#`, `$`, and `=` represent sharp, flat, and natural sign changes
- `.` adds dotted notes
- `~` and `^` help with custom beat division
- `()` denote ties/slurs
- `[]` are used for jump markers and ornament notation
- `&...` encodes many special symbols, such as accompaniment brackets or notation marks
- Dynamic markings like `&mp`, `<...!`, and `>` are supported

## Lyrics

Lyrics are represented with `C:` lines and are matched to the preceding melody line. The spec covers:

- Chinese lyrics alignment
- skipping notes with `@`
- connecting two characters to one note using `~`
- lyric comments before the text
- English lyric handling with `/` separators

## Multi-part and advanced notation

The spec also supports more advanced score writing, including:

- accompaniment and layered voices
- multiple voice parts in the same score
- custom bracket placement for different parts
- temporary time signatures and changes within a measure
- repeated sections and jump markers
- notes annotations and measure separators

## In short

This project defines a human-readable text format for composing and rendering simplified notation scores. It is designed to let users write songs in a quick, text-based script while preserving enough musical detail to produce readable sheet music and other outputs.

## Source files reviewed

The summary above is based on the project specification files in the `spec/` directory:

- `00-封面.md`
- `01-简介.md`
- `02-描述头.md`
- `03-曲部分.md`
- `04-歌词部分.md`
- `05-建议.md`
- `SUMMARY.md`
