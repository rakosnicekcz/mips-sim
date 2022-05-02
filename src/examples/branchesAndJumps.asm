.text

# simple jump
li $t0, 10
j jump_target1

move $t0, $zero    # not gonna happen

jump_target1:

nop
nop
nop
nop

# simple conditional branch
li $t0, 0
beq $t0, $zero, jump_target2    # jump if $t0 == $zero
li $t0, 6                       # not gonna happen

jump_target2:

nop
nop
nop
nop

# loop example
li $t0, 0 # conter
li $t1, 5 # max value
li $v0, 1 # for syscall to print int

loop_start:
beq $t0, $t1, loop_end      # jump out of loop if $t0 == $t1

move $a0, $t0               # $a0 = $t0
syscall                     # print $a0 

addi $t0, $t0, 1            # $t0 = $t0 + 1
j loop_start

loop_end:
halt