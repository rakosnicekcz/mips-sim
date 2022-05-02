.data
    txt1: .asciiz "length of the string: "
    txt2: .asciiz " is "
.text

# read string from user and return length of the string

li $t0, 10          # max len of string + 1

# allocate space for string
li $v0, 9           # sbrk 
move $a0, $t0       # 10 bytes
syscall             # $v0 = address of allocated space

move $a0, $v0
move $a1, $t0
li $v0, 8           # read string
syscall

move $s0, $a0       # user input

li $t1, 0           # index
loop:
    add $t4, $t1, $s0       # t4 = address of char in string
    lb $t5, 0($t4)          # read char
    beq $t5, $zero, end     # jump out if char == 0 (null)
    addi $t1, $t1, 1        # increment index
    beq $t1, $t0, end       # jump out if index == max length
j loop

end:
la $a0, txt1
li $v0, 4       # print string
syscall

move $a0, $s0
syscall

la $a0, txt2
syscall

li $v0, 1       # print int (length of string)
move $a0, $t1
syscall