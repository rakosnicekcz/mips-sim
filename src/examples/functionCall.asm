.text

# simple function call usage

li $a0, 10
li $a1, 20
jal addNums       # call procedure
move $t0, $v0     # move return value to $t0
j endExample1

addNums:
    add $v0, $a0, $a1
    jr $ra              # return (Copy $ra to PC)

endExample1:
nop
nop
nop
nop

# function call with use of stack

li $a0, 10
li $a1, 4
li $a2, 0xabc
jal allocateArray
halt

# ----- args -----
# $a0: number of elements
# $a1: size of element in bytes
# $a2: initial value
# ---- return ----
# $v0: address of array
allocateArray:
    addi $sp, $sp, -12
    sw $s0, 0($sp)
    sw $s1, 4($sp)
    sw $ra, 8($sp)

    move $s0, $a0     # $s0 = number of elements
    mul $a0, $s0, $a1 # allocate size

    li $v0, 9 # sbrk (allocate memory)
    syscall

    move $a0, $s0
    move $a3, $v0
    jal initArray

    lw $ra, 8($sp)
    lw $s1, 4($sp)
    lw $s0, 0($sp)
    addi $sp, $sp, 12

    jr $ra

# ----- args -----
# $a0: number of elements
# $a1: size of element in bytes
# $a2: initial value
# $a3: array address
initArray:
    li $t0, 0 # index
  initStart:
    beq $t0, $a0, endOfInit
    mul $t4, $a1, $t0 # t4 = index * size of element (offset)
    add $t1, $a3, $t4 # address
    sw $a2, 0($t1)
    addi $t0, $t0, 1
    j initStart
  endOfInit:
    jr $ra