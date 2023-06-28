import React, { useState } from 'react'
import { View ,StyleSheet,Text,StatusBar,TextInput, TouchableOpacity,Image, ImageBackground, ToastAndroid,} from 'react-native'


export default function Loginscreen({navigation}){
    const [logData,setLogData] = useState({email:'',password:''})
    const [hide,sethide] = useState(true)
    const [front,setfront] = useState({email:false,pass:false})
    const [message,setmessage] = useState('')
    const [btn,setbtn] = useState(false)

    const login =async ()=>{  
        const request_option = {       
            method: 'POST',
            headers:{ "Content-Type": "application/json"},
            body: JSON.stringify({data:logData}),
            redirect: 'follow'
          }
        await fetch('http://192.168.1.18:7777/login',request_option)
        .then((response) => response.json())
        .then((json) => {
            if(json == 'correct'){
                navigation.replace('Main',{logData})
            }
            else if(json != 'correct'){
                ToastAndroid.show('Wrong Email or Password', ToastAndroid.SHORT);
            }
        })
        .catch(error => console.log('error', error));
        setbtn(false)
    }

    const frontemail=(e)=>{
        let email_ref = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if(email_ref.test(e)){
            setfront({...front,email:true})
            setmessage('');
        }
        else{
            setmessage('Email must be in formate')
            setfront({...front,email:false})
        }
        //console.log(e)
    }

    const frontpass=(e)=>{
        if(e.length < 6){
            setmessage('Password length wrong')
            setfront({...front,pass:false})
        }
        else{
            setfront({...front,pass:true})
            setmessage('');
        }
    }

    //console.log(front)
    return (
        <ImageBackground source={require('./assets/login.png')}  style={styles.container}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "white" translucent = {true}/>
            {/* logo container */}
            <View style={styles.logo}>
                <Image source={require('./assets/logo.png')} style={{height:110,width:110}} />
            </View>
            {/* login container */}
            <View style={{alignItems:'center'}}>
                <Text style={{fontSize:30,fontWeight:'700',marginBottom:10}}>LOGIN</Text>
                <Text style={{fontWeight:200,marginTop:8,marginBottom:8}}>Please Fill in all Details </Text>
                <TextInput style={[styles.inputfield,{backgroundColor:logData.email? '#FFEFEF':'white'}]}  onChangeText={(e) => {setLogData({...logData,email:e});frontemail(e);setbtn(true)}} placeholderTextColor='#FF6666' placeholder='Email'/>
                <TextInput style={[styles.inputfield,{backgroundColor:logData.password? '#FFEFEF':'white'}]}  onChangeText={(e) => {setLogData({...logData,password:e});frontpass(e);setbtn(true)}} secureTextEntry={hide} placeholderTextColor='#FF6666' placeholder='Password'/>
                {hide ?
                <TouchableOpacity style={{position:'absolute',top:160,left:230}} onPress={()=> sethide(!hide)}><Image style={{height:22,width:22}} source={require('./assets/redhide.png')}/></TouchableOpacity> :
                <TouchableOpacity style={{position:'absolute',top:160,left:230}} onPress={()=> sethide(!hide)}><Image style={{height:22,width:22}} source={require('./assets/redunhide.png')}/></TouchableOpacity>
                }
                {message?
                 <Text style={{fontWeight:500}}>{message}</Text> : <></>
                }
                {
                front.email && front.pass && btn? 
                <TouchableOpacity style={styles.loginbtn} onPress={login}><Text style={{fontWeight:600,color:'white'}}>LOGIN</Text></TouchableOpacity> :
                <View style={[styles.loginbtn,{backgroundColor:'#FF6666'}]}><Text style={{fontWeight:600,color:'white'}}>LOGIN</Text></View>
                }   
                <TouchableOpacity ><Text>Forget Password?</Text></TouchableOpacity>  
            </View>
            {/* register container */}
            <View style={{flexDirection:'row',position:'relative',top:115}}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => {navigation.replace('Registerscreen')}}><Text style={{fontWeight:600,color:'white'}}>Sign up</Text></TouchableOpacity>
            </View>
        </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    inputfield:{
        width:245,
        height:50,
        backgroundColor:'white',
        marginBottom:9,
        fontSize:15,
        fontStyle:'italic',
        color:'red',
        paddingLeft:20,
        borderRadius:30,
        borderColor:'red',
        borderWidth:2,
    },
    loginbtn:{
        width:300,
        height:60,
        borderRadius:30,
        marginVertical:8,
        marginBottom:8,
        alignItems:'center',
        elevation:10,
        justifyContent:'center',
        backgroundColor:'red',
    },
    logo:{
        alignItems:'center',
        marginBottom:15,
    }
})