### we need ;
1) a server (linux ) that will run cmnd and return it to out client side using nodejs and child thread in nodejs



### article that tells about child process 
[url](https://www.sohamkamani.com/nodej/executing-shell-commands/)

### How to Get Started with AWS Free Tier

Sign Up for AWS Free Tier:

Create an AWS account if you don't have one. AWS Free Tier Sign Up
Launch a Free EC2 Instance:

Go to the EC2 Dashboard.
Click “Launch Instance.”
Choose an Amazon Machine Image (AMI) such as Ubuntu.
Select a t2.micro or t3.micro instance type (which is free tier eligible).
Configure security settings (allow SSH access).
Connect to Your Instance:

Use SSH to connect to your instance from your terminal.
bash
```
ssh -i /path/to/your-key.pem ubuntu@your-instance-public-ip
```

Deploy and Test Your Application:

Upload your web application or scripts.
Install necessary software and run your commands.

### Logi behing working of web shell

this shell will take command from user and exicute it on server ( linux server on backend ) and save it in a file and rediret the file content to the client and delete the file after 5 sec . 


## we need  to use 

1) fs function in js 

2) settimeout function 

3) express to create api so that we can fetch on it 