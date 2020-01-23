file=$1

#cat $file | grep "class=" | sed -e "s/class=/\\nclass=/" | grep "class="  | sed -e 's/^class=\([^ ]*\).*/\1: \1/g'

cat $file \
   | grep "class=" \
   | sed -e "s/class=/\\nclass=/" \
   | grep "class="  \
   | sed -e "s/^class=\([a-zA-Z0-9\"']*\).*/\1 : \1,/g";