#!/usr/bin/python

#***********************************************
# zhipu format: http://zhipu.lezhi99.com/Zhipu-index.html
#               http://doc.lezhi99.com/zhipu#154
# 
# Author: Rolland. 
# Date:   2022.10.02.
# Price:  $$$
#
##***********************************************
## from_key: music major of notes
## to_key  : harmonica major you want to play the music
##      e.x. We want to play F major movable-do notes with a C major harmonica. 
##           We want to get F major fix-do notes
##      python zhipu-transpose.py -m F -k C -i songs/tianyi.jps
##      python zhipu-transpose.py -m F -k C -a -12 -i songs/sometime-when-it-rains.jps
##
##      e.x. If we want to play A major movable-do note with a Ab major harmonica. 
##           We will want to get Ab movable-do note
##      python zhipu-transpose.py -m A -k Ab -i TomatoNotes/Ab.KissTheRain.jps
##      python zhipu-transpose.py -m F -k C -i songs/always.jps
## 
## Some examples to transpose movable-do from one key to harmonica key
##    python zhipu-transpose.py -m F -k C -a 0   -i songs/tianyi.jps
##    python zhipu-transpose.py -m F -k C -a 0   -i songs/tianyi.jps -o songs/tianyi.txt
##    python zhipu-transpose.py -m F -k C -a -12 -i songs/tianyi.jps
##    python zhipu-transpose.py -m F -k C -a 0   -i songs/tianyi.jps -o songs/tianyi.txt
##    python zhipu-transpose.py -m Eb -k C -a 0 -i songs/WaltzNo2.jps

## You can also see how each note is transposed
##    python zhipu-transpose.py -h
##    python zhipu-transpose.py -m E -k C
##    python zhipu-transpose.py -m E -k C -a 0
##    python zhipu-transpose.py -m E -k C -a 1
##    python zhipu-transpose.py -m E -k C -a -1
##***********************************************

from os.path import exists
import sys
from io import open
import argparse

# global variables
sharp_notes = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"]
flat_notes = ["1","2$","2","3$","3","4","5$","5","6$","6","7$","7"]
sharp_major_keys = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
flat_major_keys = ['C','D$','D','E$','E','F','G$','G','A$','A','B$','B']
alternative_notes = {
  "3#": "4",
  "3,#": "4,",  "3#,": "4,",
  "3,,#": "4,,",  "3#,,": "4,,",
  "3'#": "4'",  "3#'": "4'",
  "3''#": "4''",  "3#''": "4''",
  "7,#": "1", "7#,": "1", 
  "7#": "1'", 
  "7#'": "1''",
}
###########################################################
def replace_alternative_note(note):
  if note in alternative_notes :
    return alternative_notes.get(note)
  return note

###########################################################
def is_valid_key(key):
  major_key_index = get_major_index(key)
  if major_key_index != None:
    return True
  return False

################################################
def is_one_of_seven_key(note):
  return note in ('1', '2', '3', '4', '5', '6', '7')

###########################################################
def move_note(note, num_semitone):
  # handle harmonica alternative notes such as 3# 7#
  note = replace_alternative_note(note)

  max_len = 12
  flat_symbol = ","
  sharp_symbol = "'"

  clean_note = note.replace(flat_symbol, "").replace(sharp_symbol, "")
  flat = note.count(flat_symbol)
  sharp = note.count(sharp_symbol)
  if clean_note in sharp_notes:
    note_pos = sharp_notes.index(clean_note)
  elif clean_note in flat_notes:
    note_pos = flat_notes.index(clean_note)
  else:
    raise Exception(f'Invalide note: "{note}"')

  pos = note_pos + num_semitone
  if (pos < 0):
    flat = flat + 1
    pos = pos + max_len 
  else:
    sharp =  pos//max_len + sharp
    pos = pos % max_len 
  
  adjust = sharp - flat
  if (adjust < 0):
    return sharp_notes[pos] + flat_symbol * abs(adjust)
  else:
    return sharp_notes[pos] + sharp_symbol * adjust

def get_major_index(major_key):
  major_key = fanQieKey(major_key)

  from_key_index = None
  if major_key in sharp_major_keys:
    from_key_index = sharp_major_keys.index(major_key)  
  if from_key_index != None:
    return from_key_index
  
  if major_key in flat_major_keys:
    from_key_index = flat_major_keys.index(major_key)
  if from_key_index != None:
    return from_key_index
  return None

###########################################################
def transpose_note(from_key, to_key, from_note, adjustment = 0):
  from_key_index = get_major_index(from_key)  
  to_key_index = get_major_index(to_key)

  if from_key_index == None :
    print("invalid keys", from_key)

  if to_key_index == None:
    print("invalid keys", to_key)

  diff_key = from_key_index - to_key_index + adjustment

  return move_note(from_note, diff_key)

################################################
def transpose_line(line, from_key, to_key, adjustment = 0):    
  newline = ""
  todonote = ""
  for char in line:
    # ignore space
    if char == " ":
      continue
    # handle non-space char
    if is_one_of_seven_key(char.strip()):
      if todonote == '':
        todonote = char
      else:
        ### translate
        translated_todonote = transpose_note(from_key, to_key, todonote, adjustment)
        if translated_todonote == None:
          print("invalid tune key:" + todonote)
          return ""
        newline += translated_todonote
        todonote = char
    elif char == "," or char == "'" or char == "#" or char == "$":
      # possible values: 2,#   2#,   2'#   2#'   2$,   2,$   2'$   2$'
      if todonote == "":
        newline += char
      else:
        todonote += char
    else:
      if todonote == "":
        newline += char
      else:
        ### translate
        translated_todonote = transpose_note(from_key, to_key, todonote, adjustment)
        if translated_todonote == None:
          print("invalid tune key:" + todonote)
          return ""
        newline += translated_todonote + char
      todonote = ""
  if todonote != "":
    ### translate
    translated_todonote = transpose_note(from_key, to_key, todonote, adjustment)
    if translated_todonote == None:
        print("invalid tune key:" + todonote[0])
        return ""
    newline += translated_todonote
  return newline

################################################
def fanQieKey(movable):
  movable =  movable.split('-')[0]
  keydict = {
  "C":    "C",
  "C#":   "C#",
  "Db":   "D$",
  "D":    "D",
  "D#":   "D#",
  "Eb":   "E$",
  "E":    "E",
  "F":    "F",
  "F#":   "F#",
  "Gb":   "G$",
  "G":    "G",
  "G#":   "G#",
  "Ab":   "A$",
  "A":    "A",
  "A#":   "A#",
  "Bb":   "B$",
  "B":    "B"  
  }
  return keydict.get(movable)

################################################
def savefile(lines, filename):
  file2 = open(filename, "w", encoding='utf-8')
  file2.writelines(lines)    
  file2.close()

################################################
def readfile(filename):
  file1 = open(filename, mode="r", encoding="utf-8")
  lines = file1.readlines()
  file1.close()    
  return lines
  
################################################
def transpose_file(from_key, to_key, adjustment = 0, filename = '', tofilename =''):
  if exists(filename) == False:
    print("could not found file:" + filename)
    return

  if tofilename != '' and exists(tofilename) == True:
    print("output file exists already:" + filename)
    return

  # ready to transpose
  lines = readfile(filename)

  resultlines = ''
  for line in lines:
    if line.strip().startswith('Q:'):
      # only process note lines
      transposedline = transpose_line(line, from_key, to_key, adjustment)
      resultlines += transposedline
    elif len(line.strip()) < 1:
      continue
    else:
      # skip lyric lines
      resultlines += line   
  print(resultlines)

  # save to file if requested
  if tofilename != '' and resultlines != "":
    savefile(resultlines, tofilename)

####################################
def debug(noteMovableDoKey, harmonicaKey, adjustment = 0):
  #print('-------------------------------------')
  #print(noteMovableDoKey +  ' >>>>>>>> ' + harmonicaKey)
  #print('-------------------------------------')

  for k in sharp_notes:
    t = transpose_note(noteMovableDoKey, harmonicaKey, str(k), adjustment)
    print(noteMovableDoKey, harmonicaKey, k, t)
  #print('-------------------------------------')

####################################
def debug_table():
  notes =  ['1', '1#', '2', '2#', '3', '4', '4#', '5', '5#', '6', '6#', '7']
  for hk in sharp_major_keys:
    for fk in flat_major_keys:
      sharp = set()
      for fn in notes:
        hn = transpose_note(fk, hk, fn, 0)
        if hn.endswith('#'):
          sharp.add(hn)
      if len(sharp) < 3:
        s = fk + '|' + hk + '|' + '-'.join(sharp)
        print(s)

#  python zhipu-transpose.py -m G -k C -i songs/hong-mei-hua-er-kai-liao-chang-yong.jps
###########################################################
  #  python zhipu-transpose.py -h
  #  python zhipu-transpose.py -a 1 -i songs/gu-yong-zhe-B-fix-do.md
  #  python zhipu-transpose.py -m E -k C
  #  python zhipu-transpose.py -m E -k C -a 0
  #  python zhipu-transpose.py -m E -k C -a 1
  #  python zhipu-transpose.py -m E -k C -a -1
  #  python zhipu-transpose.py -m E -k C -i songs/10.Shengshengman.md 
  #  python zhipu-transpose.py -m E -k C -i songs/10.Shengshengman.md -o songs/abc.txt
  #  python zhipu-transpose.py -m E -k C -o songs/abc.txt -i songs/10.Shengshengman.md 
  #  python zhipu-transpose.py -m E -k C -a 0 -i songs/10.Shengshengman.md 
  #  python zhipu-transpose.py -m E -k C -a 0 -i songs/10.Shengshengman.md -o songs/abc.txt
  #  python zhipu-transpose.py -m E -k C -a 0 -o songs/abc.txt -i songs/10.Shengshengman.md 

  ## from_key notes played with to_key(movable-do) note
  ## e.x. D major movable do note, we want to play it with C major harmonica. we want to get C major fix-do note
  ##  python zhipu-transpose.py -m D -k C -i songs/10.Shengshengman.md 
  ##
  ## e.x. F major movable do note, we want to play it with C major harmonica. we want to get C major fix-do note
  ##  python zhipu-transpose.py -m F -k C -a 0 -i songs/sometime-when-it-rains.jps

def main_with_args():
  parser = argparse.ArgumentParser(description='what can I do for you?')
  parser.add_argument('-movable_key', help='movable key of music note.')
  parser.add_argument('-key_of_harmonica', help='major key of the harmonica to play the music.')
  parser.add_argument('-adjustment', help='number of half key you want to move (-/+).')
  parser.add_argument('-input_file', help='the fanqie music note file you want to transpose.')
  parser.add_argument('-output_file', help='the output file.')

  args  = parser.parse_args()
  movable_key_v = args.movable_key
  key_of_harmonica_v = args.key_of_harmonica
  adjustment_v = args.adjustment
  input_file_v = args.input_file
  output_file_v = args.output_file

  # python zhipu-transpose.py -a -1
  if movable_key_v == None and key_of_harmonica_v == None and input_file_v != None and adjustment_v != None:
    if output_file_v == None: 
      output_file_v = ''
    adjustment_v = int(args.adjustment)
    transpose_file('C', 'C', adjustment_v, input_file_v, output_file_v)
    print('\n')
    exit

  elif movable_key_v == None and key_of_harmonica_v == None:
    print('missing movableKey_v and key_of_harmonica_v')
    exit

  elif is_valid_key(movable_key_v) and is_valid_key(key_of_harmonica_v):
    if adjustment_v == None:
      adjustment_v = 0
    else:
      adjustment_v = int(args.adjustment)

    if output_file_v == None: 
      output_file_v = ''

    if input_file_v == None:
      debug(movable_key_v, key_of_harmonica_v, adjustment_v)
    else:
      transpose_file(movable_key_v, key_of_harmonica_v, adjustment_v, input_file_v, output_file_v)
    print('\n')  
  else:
    print('\n')  
    print (sharp_major_keys)
    print('\n')  

###########################################################
if __name__ == "__main__":
  #debug_table()
  main_with_args()


 