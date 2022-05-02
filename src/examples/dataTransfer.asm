.data
value_32bit: .word 42
value_16bit: .half 99
value_8bit: .byte 18

array_32bit: .word 98, 68, 0x10, 'A'

text_helloWord: .asciiz "Hello World"           #   with 0 on end
text_part1: .ascii "The quick brown fox"        #   without 0 on end
text_part2: .asciiz " jumps over the lazy dog"  #   with 0 on end

.align 3                                        
alignedVar: .space 4

.text

# ---------------------------------------
# ----------- usnig load ----------------
# ---------------------------------------

lw $t0, value_32bit
lh $t1, value_16bit
lb $t2, value_8bit

# -------------------------

lw $t3, array_32bit            # $t3 = 98

li $t4, 4
lw $t5, array_32bit($t4)       # $t5 = 68

la $t6, array_32bit            # load memory address of array_32bit
lw $t7, 8($t6)                 # $t7 = 0x10

# ---------------------------------------
# ----------- usnig save ----------------
# ---------------------------------------

li $t0 23                      # $t0 = 68
sw $t0, value_32bit
sh $t0, value_16bit
sb $t0, value_8bit

# -------------------------
li $t1, 8
sw $t0, array_32bit($t1)

# ---------------------------------------
# ------- print using syscall -----------
# ---------------------------------------

# print char
li $v0, 11                     # syscall n.11 = print_char
li $t1, 12  
lw $a0, array_32bit($t1)       # $a0 = 'A'
syscall

#print string
li $v0, 4
la $a0, text_helloWord
syscall

#print multi-line string
li $v0, 4
la $a0, text_part1
syscall

halt