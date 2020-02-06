#!/bin/bash

dir_curr="$(dirname $0)"
dir_project="$(dirname $dir_curr)/../.."
dir_python="$dir_project/src/python"

function i_create_cert {
    echo "Create cert";
    local dir_key="$dir_project/.key";
    local crt_path="$dir_key/rpd.crt";
    local key_path="$dir_key/rpd.key";
    echo $dir_key
    echo $crt_path
    echo $key_path
    mkdir -p "$dir_key";
    #TODO:  Understand, and extend to multiple host, and ip
    #FIXME: This, or installing_cert doesen't work
    openssl req -x509 -out "$crt_path" -keyout "$key_path" \
        -newkey rsa:2048 -nodes -sha256 \
        -subj '/CN=localhost' -extensions EXT -config <( \
        printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
}

#function i_installing_cert {
#    # from https://askubuntu.com/questions/73287/how-do-i-install-a-root-certificate
#    echo "Installing cert";
#    local dir_key="$dir_project/.key";
#    local crt_path="$dir_key/rpd.crt";
#    local crt_name="`basename $crt_path`"
#    sudo mkdir -i /usr/share/ca-certificates/extra
#    sudo cp "$crt_path" "/usr/share/ca-certificates/extra/$crt_name"
#    sudo dpkg-reconfigure ca-certificates
#    sudo update-ca-certificates
#
#
#}

function i_copy_sample_config {
    cp -v "$dir_python/config.sample.json" "$dir_python/config.json"
}

function i_make_data_dir {
    mkdir -vp "$dir_project/data"
}
function all {
    for command in `cat $dir_curr/install.sh | grep "^function i_" | grep -v "install_for_loop" | sed "s/^function //g" | sed 's/{$//g'`; do #install_for_loop
        $command $@;
    done
}

command="$1";
shift;
command="`echo "$command" | sed "s/^i_//g"`"
if [ "$command" != "all" ]; then
    command="i_$command"
fi
if [ "i_" == "$command" ]; then
    command="all"
fi
$command $@;
