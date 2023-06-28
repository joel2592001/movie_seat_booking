import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text,Image, TouchableOpacity,StatusBar, ToastAndroid, ImageBackground, ScrollView } from 'react-native';
import io from 'socket.io-client';
import  Modal  from "react-native-modal";


export default function Main_page({route}){

  const [data,setData] = useState([])
  const [selected,setSelected] = useState('')
  const [Index ,setIndex] = useState({row:'',coloum:''})
  const [btn,setBtn] = useState(false)
  const [modal,setModal] = useState(false)
  const [user,setUser] = useState(route.params.logData.email)
  const [ticketData,setTicketData] = useState()

  
  useEffect(()=>{
    get_ticket();
    const socket = io('http://192.168.1.18:7777');
    socket.emit('fetchData','joel')
    socket.once('fetchData',(result)=>{
      // console.log('useffect',result)
      setData(result);
    })
    // console.log('useffects')
    return () => {
      socket.disconnect();
    };
  },[])

  const select_seat=(e)=>{
    if(e == selected){
      setSelected('')
      setBtn(false)
    }
    else{
      setSelected(e)
      setBtn(true)
    }
  }

  const send = ()=>{
    
    const socket = io('http://192.168.1.18:7777');
    socket.emit('bookedSeat',{Index:Index,user:user,seat_no:selected})
    socket.on('bookedSeat',(result)=>{
      console.log(result,'book seat')
      setData(result)
    })
    
    socket.on('message',(result)=>{
      if(result == 'success'){
        ToastAndroid.show(`${selected} : Booked Successfully`, ToastAndroid.SHORT);
        get_ticket();
      }
      else{
        ToastAndroid.show(`${selected} : Already Booked`, ToastAndroid.SHORT);
      }
    })
    setBtn(false)
  }

  const get_ticket = async () =>{
    const request_option = {       
      method: 'POST',
      headers:{ "Content-Type": "application/json"},
      body: JSON.stringify({email:user}),
      redirect: 'follow',
    }
    await fetch('http://192.168.1.18:7777/usertickets',request_option)
    .then((response) => response.json())
    .then((json) => {
      if(json.success === 'fetched successfully'){
        setTicketData(json.data)
      }
      console.log(json.data[0].ticket)
      
    })
    // .catch(error => console.log('error', error));
  }
  
  return (
    <View style={styles.container}>
      <StatusBar  hidden = {false} backgroundColor = {'purple'} translucent = {true}/>
      {/* Modal */}
      <Modal animationIn='slideInRight' style={styles.modal} animationOut='slideOutRight' animationInTiming={700} animationOutTiming={600}
        onBackdropPress={()=> setModal(false)} onBackButtonPress={() => setModal(false)} isVisible={modal}>
        <View style={[styles.innermodal]}>
            {/* <View style={{paddingVertical:40,width:'100%',backgroundColor:'#E4E4E4',marginBottom:50}}> */}
                {/* inner card */}
            <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:'15%',backgroundColor:'lightgrey'}}>
              <View style={styles.profilecard}>
                  <TouchableOpacity> 
                      <Image source={{uri:'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Pic.png'}} style={{height:53,width:53,borderRadius:40,marginLeft:15,tintColor:'white'}}/>
                  </TouchableOpacity>
                  <Text style={{fontSize:17,marginRight:15,color:'white'}}>Mr.{ticketData ? ticketData[0].name : ''}</Text>
              </View>
            </View>
        
            <View style={{height:'100%',width:'100%',flex:1}}>
              <Text style={{textAlign:'center',fontSize:17,fontWeight:'600',}}>BOOKED TICKETS</Text>
              <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:'100%',paddingBottom:15}}>
                <ScrollView showsVerticalScrollIndicator={false} style={{height:'100%'}}>
                  {ticketData ?
                    ticketData[0].ticket.map((ele,ind)=>{
                      return(
                        <ImageBackground key={ind} source={require('./assets/ticketcard.png')} style={{height:111,marginBottom:10,width:250,elevation:20,flexDirection:'row'}}>
                          <View style={{justifyContent:'center',width:'30%',}}>
                            <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP42QeGUC5FVzLZzXmOPGBNCSYFNumo_FUbA&usqp=CAU/thumbs_3t/11570.jpg'}} style={{width:50,marginLeft:20,height:70,borderRadius:5}}/>
                          </View>
                          <View style={{justifyContent:'center'}}>
                              <Text style={{fontWeight:'700',fontSize:17}}>Flash (U/A)</Text>
                              <Text style={{fontSize:10,fontStyle:'italic'}}>Tamil ,3D{'\n'}Fri, 16 Jun | 10:45 AM{'\n'}Sangam Cinemas 4K</Text>
                              <Text style={{fontSize:12.8,color:'purple',}}>Seat NO : {ele}</Text>
                          </View>
                          {/* {console.log(ele)} */} 
                        </ImageBackground>
                      );
                    }):
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                      <Text style={{textAlign:'center'}}>Not Booked yet</Text>
                    </View>
                  }
                </ScrollView>
              </View>
            </View>
        
        </View>
      </Modal>
      {/* nav bar */}
      <View style={styles.header}>
        <View style={{alignItems:'center',justifyContent:'center',width:'20%'}}>
          <TouchableOpacity>
            <Image source={require('./assets/backbutton.png')} style={{width:35,height:35}}/>
          </TouchableOpacity>
        </View> 
        <View style={{}}>
          <Text style={{color:'white',fontWeight:'600',fontSize:20}}>Flash</Text>
          <Text style={{color:'white',fontStyle:'italic',fontSize:12}}>Sangam Cinemas 4K RGB Laser Dolby{'\n'} Atmos,Kilpauk</Text>
        </View>
        <View style={{justifyContent:'center',width:'20%'}}>
          <TouchableOpacity onPress={()=>setModal(true)} style={{flexDirection:'row-reverse'}}>
            <Image source={require('./assets/ticket.png')} style={{width:40,height:35,tintColor:'white'}}/>
          </TouchableOpacity>
        </View>
      </View>
      {/* movie details */}
      <View style={{width:'100%',height:80,backgroundColor:'purple',flexDirection:'row',alignItems:'center',gap:10}}>
        <View style={{justifyContent:'center',width:'25%'}}>
            <Text style={{color:'white',marginLeft:10,fontSize:16}}>Fri</Text>
            <Text style={{color:'white',fontWeight:'800',fontSize:17,marginLeft:10}}>16 jun</Text>
        </View>
        <TouchableOpacity style={{alignItems:'center',justifyContent:'center',elevation:15,width:'30%',height:55,backgroundColor:'white',borderRadius:8}}>
            <Text style={{fontSize:15}}>10:45 AM</Text>
            <Text style={{fontWeight:'800',}}>3D</Text>
        </TouchableOpacity>
        <View>
          <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP42QeGUC5FVzLZzXmOPGBNCSYFNumo_FUbA&usqp=CAU/thumbs_3t/11570.jpg'}} style={{width:130,height:70,borderRadius:7}}/>
        </View>
      </View>
      {/* seat selected details */}
      <View style={{flexDirection:'row',gap:10,alignItems:'center',justifyContent:'center',width:'100%',height:'8%',marginBottom:-8}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{width:18,height:18,backgroundColor:'lightgrey',borderWidth:0.2,borderRadius:20}}/>
          <Text>AVAILABLE</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{width:18,height:18,backgroundColor:'grey',borderWidth:0.2,borderRadius:20}}/>
          <Text>BOOKED</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{width:18,height:18,backgroundColor:'green',borderWidth:0.2,borderRadius:20}}/>
          <Text>SELECTED</Text>
        </View>
      </View>
      {/* seats position */}
      <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%'}}>
      {/* seats */}
      <View style={styles.card}>
        <Text style={{fontWeight:'700',fontSize:12.5}}>QUARTZ : ₹170.56 + GST</Text>
          {
            data.map((row,index)=>{
              return(
              <View key={index} style={{flexDirection:'row',gap:11}}>
                {
                  row.map((ele,ind)=>{
                      return(
                          ele == 0?
                        <View key={ind}>
                          <Image source={require('./assets/seatoccupied.png')} style={{width:34,height:43,opacity:0.5,tintColor: 'black'}}/>
                          <Text style={{textAlign:'center',fontSize:10}}>Booked</Text>
                        </View>
                        :<TouchableOpacity key={ind} onPress={()=>{select_seat(ele);setIndex({row:index,coloum:ind})}} style={{}}>
                          <Image source={require('./assets/seatoccupied.png')} style={{width:34,height:43,opacity:0.5,tintColor: selected == ele && ele != 0 ? 'green':'lightgrey' }}/>
                          <Text style={{textAlign:'center',fontSize:10}}>{ele}</Text>
                        </TouchableOpacity>  
                      )
                  })
                }
              </View>
              )
            })
          }
      </View>
      {/* screen */}
      <View style={styles.movieScreen}>
        <Image source={require('./assets/screen.png')} style={{width:400,height:64,marginBottom:-10}}/>
      </View>
      </View>
      {/* footer */}
      <View style={styles.footer}>
      {btn ?
        <TouchableOpacity style={styles.sendButton} onPress={()=>send()}>
          <Text style={{fontWeight:'700'}}>Book Ticket</Text>
        </TouchableOpacity>:<></>
      }
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:Platform.OS == 'android' ? StatusBar.currentHeight : 0,
      // backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      width:'100%',
      height:'10%',
      backgroundColor:'purple',
      flexDirection:'row',
      borderBottomWidth:0.3,
      // borderColor:'black',
    },
    footer:{
      width:'100%',
      backgroundColor:'purple',
      height:'8.5%',
      alignItems:'center',
      justifyContent:'center'
    },
    // bus_header:{
    //   width:'100%',
    //   alignItems:'center',
    //   justifyContent:'center',
    //   height:80,
    //   borderBottomWidth:0.2,
    //   borderColor:'black',
    //   marginBottom:15,
    //   flexDirection:'row',
    //   justifyContent:'space-between'
    // },
    // bus_seat:{
    //   flexDirection:'row',
    //   gap:18,
    //   alignItems:'center',
    //   justifyContent:'center',
    //   width:'50%',
    //   // backgroundColor:'red',
    //   height:60,
    // },
    card:{
      // flex:1,
      flexDirection:'column',
      gap:10,
      alignItems:'center',
      justifyContent:'center',
      elevation:10,
      backgroundColor:'white',
      width:'92%',
      height:'78%',
      borderRadius:10,
    },
    sendButton:{
      width:'90%',
      height:'70%',
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:30,
    },
    movieScreen:{
      alignItems:'center',
      justifyContent:'center',
      marginTop:20,
    },
    modal:{
      margin:0,
      alignItems:'flex-end',
    },
    innermodal:{
        backgroundColor:'white',
        width:'78%',
        height:'100%',
        flex:1, 
    },
    profilecard:{
      width:'80%',
      height:80,
      backgroundColor:'purple',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      gap:10,
      borderRadius:20,
  },
  });