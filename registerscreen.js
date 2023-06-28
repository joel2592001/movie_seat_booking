import React, { useState } from 'react'
import { View ,StyleSheet,Text, TextInput, TouchableOpacity,ToastAndroid, ImageBackground,Image} from 'react-native'

export default function Registerscreen({navigation}){
  
  const [reg,setreg] = useState({name:'',email:'',password:''})
  const [message,setmessage] = useState('')
  const [hide,sethide] = useState(true)
  const [fronthandle,setfronhandle] = useState({name:false,email:false,pass:false})
  const [messagefront,setmessagefront] = useState('')
  const [btn,setbtn] = useState(false)
  //const [display,setdisplay] = useState(true)
  
  //console.log(reg)
  const validate= async ()=>{

    const request_option = {       
      method: 'POST',
      headers:{ "Content-Type": "application/json"},
      body: JSON.stringify({data:reg}),
      redirect: 'follow'
    }
    console.log(reg)
    await fetch('http://192.168.1.15:7777/register',request_option)
      //navigation.navigate('Loginscreen')
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if(json != 'Registered successfully')
        {
          setmessage(json)
          //ToastAndroid.show(json, ToastAndroid.SHORT);
          setTimeout(() => {
            setmessage('')
           }, 3500);
        }
        if(json == 'Registered successfully')
        {
          ToastAndroid.show(json, ToastAndroid.SHORT);
          navigation.navigate('Loginscreen')
        }
        console.log(json)
      })  
      .catch(error => console.log('error', error));
      setbtn(false)
  }
  
  const frontvalname=(e)=>{
    let name_ref = /^[^\s]+(\s+[^\s]+)*$/;

    if(name_ref.test(e)){
      setfronhandle({...fronthandle,name:true})
      setmessagefront('')
    }
    else{
      setmessagefront('Four char long and not contain special char')
      setfronhandle({...fronthandle,name:false})
    }
  }

  const frontvalemail=(e)=>{
    let email_ref = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(email_ref.test(e)){
      setfronhandle({...fronthandle,email:true})
      setmessagefront('')
    }
    else{
      setmessagefront('Email must be in formate')
      setfronhandle({...fronthandle,email:false})
    }
  }

  const frontvalpass=(e)=>{
    if(e.length < 6){
      setmessagefront('password must be six char long')
      setfronhandle({...fronthandle,pass:false})
    }
    else{
      setfronhandle({...fronthandle,pass:true})
      setmessagefront('')
    }
  }

  return (
        <ImageBackground source={require('./assets/register.png')}  style={styles.container}>
          <View style={{alignItems:'center'}}>
              <Text style={{fontSize:30,fontWeight:'700',marginBottom:10,color:'black'}}>REGISTER</Text>
              <Text style={{fontWeight:200,marginTop:8,marginBottom:8,color:'white'}}>Please Fill in all Details </Text>
              <TextInput style={[styles.inputfield,{backgroundColor:reg.name? 'rgba(300, 300, 300, 0.2)':'#EC2222'}]} onChangeText={(e)=> {setreg({...reg,name:e});frontvalname(e);setbtn(true)}} placeholderTextColor='white' placeholder='Name'/>
              <TextInput style={[styles.inputfield,{backgroundColor:reg.email? 'rgba(300, 300, 300, 0.2)':'#EC2222'}]} onChangeText={(e)=> {setreg({...reg,email:e});frontvalemail(e);setbtn(true)}} placeholderTextColor='white' placeholder='Email'/>
              <TextInput style={[styles.inputfield,{backgroundColor:reg.password? 'rgba(300, 300, 300, 0.2)':'#EC2222'}]} onChangeText={(e)=> {setreg({...reg,password:e});frontvalpass(e);setbtn(true)}} secureTextEntry={hide} placeholderTextColor='white' placeholder='Password'></TextInput>
              {hide ?
              <TouchableOpacity style={{position:'absolute',top:218,left:230}} onPress={()=> sethide(!hide)}><Image style={{height:22,width:22}} source={require('./assets/hide.png')}/></TouchableOpacity> :
              <TouchableOpacity style={{position:'absolute',top:218,left:230}} onPress={()=> sethide(!hide)}><Image style={{height:22,width:22}} source={require('./assets/unhide.png')}/></TouchableOpacity>
              }
              {messagefront?
                <Text style={{color:'#FFFF99',fontWeight:500}}>{messagefront}</Text> : <></>
              }
              { message ?
                <Text style={{color:'#FFFF99',fontWeight:500}}>{message}</Text> : <></>
              }
              { fronthandle.name && fronthandle.email && fronthandle.pass && btn?
              <TouchableOpacity style={styles.loginbtn} onPress={validate}><Text style={{fontWeight:600,color:'red'}}>REGISTER</Text></TouchableOpacity>:
              <View style={[styles.loginbtn,{backgroundColor:'#E6E6E6',}]}><Text style={{fontWeight:600,color:'red'}}>REGISTER</Text></View>
              }
          </View>
          <View style={{flexDirection:'row',position:'absolute',bottom:20}}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.replace('Loginscreen')}><Text style={{color:'white',fontWeight:600}}>Sign in</Text></TouchableOpacity>
          </View>
        </ImageBackground>
        
  )
}

const styles = StyleSheet.create({
  container:{
      flex:1,
      paddingTop:Platform.OS == 'android' ? 0 : StatusBar.currentHeight,
      alignItems:'center',
      justifyContent:'center',
      //backgroundColor:'white',
  },
  inputfield:{
    width:245,
    height:50,
    color:'white',
    //opacity:0.8,
    //backgroundColor:'#EC2222',
    fontSize:15,
    fontStyle:'italic',
    marginBottom:9,
    paddingLeft:20,
    borderRadius:30,
    borderColor:'white',
    borderWidth:2,
},
loginbtn:{
    width:300,
    height:60,
    borderRadius:30,
    marginVertical:8,
    //marginBottom:20,
    alignItems:'center',
    elevation:10,
    justifyContent:'center',
    backgroundColor:'white',
},
})