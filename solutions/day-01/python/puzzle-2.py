#!/usr/bin/env python3
import os

inputPath = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../input.txt"))

file = open(inputPath, 'r')
input = file.read()
file.close()

sum = 0
offset = int(len(input) / 2)

for index in range(0, len(input) - 1):
    target = (index + offset) % len(input)
    if input[index] == input[target]:
        sum += int(input[index])

print(sum)