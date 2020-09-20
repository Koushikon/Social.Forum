# Social.Forum
# Live App Here: https://aroot-user-social-forum.herokuapp.com
This is the BCA 6th-sem project i'm working on.<br/>

<b><u>Add .env file in the root directory</u></b><br/>
&nbsp; PORT=<Input_PORT><br/>
&nbsp; DB_USER=<Input_DB_USER><br/>
&nbsp; DB_PASS=<Input_DB_PASS><br/>
&nbsp; DB_NAME=<Input_DB_NAME><br/>
&nbsp; SENDGRID_API_KEY=<Input_SENDGRID_API_KEY><br/>
&nbsp; SESSION_NAME=<Input_SESSION_NAME><br/>
&nbsp; SESSION_SECRET=<Input_SESSION_SECRET><br/>

<b><u>Add three .bat files if you want to</u></b><br/>
&nbsp; <b>#1 One For Run databse localy</b><br/>
&nbsp; | &nbsp; <code>cd&#47;</code> -To go root of your drive<br/>
&nbsp; | &nbsp; <code>D&#58;</code> -Set drive where mongodb installed<br/>
&nbsp; | &nbsp; <code><MongoDB_File_with_mongod_Path> --dbpath=<Your_MongoDB_Data_Path>/</code><br/>
&nbsp; | &nbsp; Save It. And Run Whenever you need -Just Dubble Click<br/>
	
&nbsp; <b>#2 One For Start The Server with view Mode (in package.json)</b><br/>
&nbsp; | &nbsp; <code>npm run start</code> -To_Start_Server_with_Node<br/>
&nbsp; | &nbsp; Save It. And Run Whenever you need -Just Dubble Click<br/>

&nbsp; <b>#3 One For Run In Development Mode With #1 [Nodemon] (in package.json)</b><br/>
&nbsp; | &nbsp; <code>call Project_DB.bat</code> -Call DB Run batch file(#1)<br/>
&nbsp; | &nbsp; <code>npm run dev</code><br/>
&nbsp; | &nbsp; Save It. And Run Whenever you need -Just Dubble Click<br/>
