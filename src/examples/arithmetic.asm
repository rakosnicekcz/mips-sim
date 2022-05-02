.text
li $t0, 10          # $t0 = 10
li $t1, 0x10        # $t1 = 16

add $t2, $t0, $t1   # $t2 = $t0 + $t1
sub $t3, $t0, $t1   # $t3 = $t0 - $t1

addi $t4, $t0, 10   # $t4 = $t0 + 10

mul $t5 $t4, $t1    # $t5 = $t4 * $t1
mult $t4, $t1       # $hi,$low=$2*$3
mfhi $t6            # $t6 = $hi
mflo $t7            # $t7 = $low

div $t1, $t0        # $hi,$low=$2/$3
mfhi $t6            # $t6 = $hi
mflo $t7            # $t7 = $low

move $t6, $t7       # $t6 = $t7
halt                # stop execution