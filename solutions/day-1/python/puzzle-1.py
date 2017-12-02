import os

inputPath = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../input.txt"))

file = open(inputPath, 'r')
input = file.read()
file.close()

sum = 0

for index in range(0, len(input) - 2):
    if input[index] == input[index + 1]:
        sum += int(input[index])

if input[len(input) - 1] == input[0]:
    sum += int(input[0])

print(sum)