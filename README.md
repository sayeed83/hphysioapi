
ssh root@103.12.1.152 -p 57365
vi /etc/apache2/sites-available/hpysio-api.com.conf
<VirtualHost *:80>
    ServerName 103.12.1.154
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>

<VirtualHost *:80>
 ServerName 103.12.1.154
 DocumentRoot /var/www/project/hpysio/api/hpysio_prod
    <Directory /var/www/project/hpysio/api/hpysio_prod>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
sudo a2ensite hpysio-api.com.conf

cd /var/www/project/hpysio/api/hpysio_prod
pm2 start server.js --name prodlongrun
pm2 startup systemd
pm2 delete all
pm2 reload all
sudo systemctl restart apache2
sudo service apache2 restart

http://103.12.1.154/
