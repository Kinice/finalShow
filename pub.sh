#! /bin/bash
# Created by Kinice
echo '开始登陆服务器'
ssh root@139.129.30.246 'cd finalShow/;git pull;npm install;forever restartall;'

