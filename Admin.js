import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, TouchableOpacity, Image, Text, ToastAndroid } from 'react-native';
import { View } from 'react-native';
import io from 'socket.io-client';

export default function Admin(){

  const [data,setData] = useState([])

  const [selected,setSelected] = useState('')
  const [Index ,setIndex] = useState({row:'',coloum:''})
  const [btn,setBtn] = useState(false)

  const [disableSelected,setDisableSelected] = useState('')
  const [freeIndex,setFreeIndex] = useState({row:'',coloum:''})
  const [btnFree,setBtnFree] = useState(false)


  const seat = [
    [1,2,3,4,5,6,7],
    [8,9,10,11,12,13,14],
    [15,16,17,18,19,20],
    [21,22,23,24,25,26]
  ]

  useEffect(()=>{
    const socket = io('http://192.168.1.18:7777');
    socket.emit('fetchData','joel')
    socket.once('fetchData',(result)=>{
      console.log('useffect',result)
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
      setBtnFree(false)
    }
  }

  const free_select_seat=(e)=>{
    // console.log((data[freeIndex.row][(freeIndex.coloum)]),freeIndex.row,freeIndex.coloum)
    if(e == 0){
      setBtnFree(true)
    }
    else{
      setBtnFree(false)
    }
  }

  const block_seat=()=>{
    const socket = io('http://192.168.1.18:7777');
    socket.emit('blockSeat',{Index:Index})
    socket.once('blockSeat',(result)=>{
      console.log(result,'block seat')
      setData(result)
    })
    ToastAndroid.show(`${selected} : Blocked Successfully`, ToastAndroid.SHORT);
    setBtn(false)
  }

  const freeup_seat=()=>{
    const socket = io('http://192.168.1.18:7777');
    socket.emit('freeup',{Index:freeIndex})
    socket.once('freeup',(result)=>{
      console.log(result,'block seat')
      setData(result)
    })
    ToastAndroid.show(`${seat[freeIndex.row][freeIndex.coloum]} : Freed Up Successfully`, ToastAndroid.SHORT);
    setBtnFree(false)
  }

  // console.log(freeIndex)

  return (
    <View style={styles.container}>
      <StatusBar  hidden = {false} backgroundColor = {'purple'} translucent = {true}/>
      {/* header */}
      <View style={styles.header}>
        <View style={{alignItems:'center',justifyContent:'center',width:'20%'}}>
          <TouchableOpacity activeOpacity={0.5}>
            <Image source={require('./assets/backbutton.png')} style={{width:35,height:35}}/>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent:'center'}}>
          <Text style={{color:'white',fontWeight:'600',fontSize:20}}>Admin Panel</Text>
        </View>
      </View>
       {/* content */}
      <View style={{flex:1,width:'100%'}}>
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%'}}>
        {/* seats */}
        <View style={styles.card}>
          <Text style={{fontWeight:'700',fontSize:12.5}}>QUARTZ : ₹170.56 + GST</Text>
            {data ?
              data.map((row,index)=>{
                return(
                <View key={index} style={{flexDirection:'row',gap:11}}>
                  {
                    row.map((ele,ind)=>{
                        return(
                            ele == 0?
                          <TouchableOpacity key={ind} onPress={()=>{setFreeIndex({row:index,coloum:ind});free_select_seat(ele);setBtn(false);setSelected('')}}>
                            <Image source={require('./assets/seatoccupied.png')} style={{width:34,height:43,opacity:0.5,tintColor: 'black'}}/>
                            <Text style={{textAlign:'center',fontSize:10}}>Blocked</Text>
                          </TouchableOpacity>
                          :<TouchableOpacity key={ind} onPress={()=>{select_seat(ele);setIndex({row:index,coloum:ind})}} style={{}}>
                            <Image source={require('./assets/seatoccupied.png')} style={{width:34,height:43,opacity:0.5,tintColor: selected == ele && ele != 0 ? 'green':'lightgrey' }}/>
                            <Text style={{textAlign:'center',fontSize:10}}>{ele}</Text>
                          </TouchableOpacity>  
                        )
                    })
                  }
                </View>
                )
              }):<></>
            }
        </View>
        {/* screen */}
        <View style={styles.movieScreen}>
          <Image source={require('./assets/screen.png')} style={{width:400,height:64,marginBottom:-10}}/>
        </View>
        </View>
      </View>
      {/* footer */}
      <View style={styles.footer}>
        {btn ?
          <TouchableOpacity style={[styles.blockseat]} onPress={()=>block_seat()}>
            <Text style={{fontWeight:'700',color:'red'}}>Block Seat No : {selected}</Text>
          </TouchableOpacity> : <></>
        }
        {btnFree ?
          <TouchableOpacity style={styles.blockseat} onPress={()=>freeup_seat()}>
            <Text style={{fontWeight:'700',color:'green'}}>Free Up Seat No : {(seat[freeIndex.row][freeIndex.coloum])}</Text>
          </TouchableOpacity> : <></>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:Platform.OS == 'android' ? StatusBar.currentHeight : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header:{
    width:'100%',
    height:'10%',
    backgroundColor:'purple',
    flexDirection:'row',
    borderBottomWidth:0.3,
  },
  footer:{
    width:'100%',
    backgroundColor:'purple',
    height:'8.5%',
    alignItems:'center',
    justifyContent:'center'
  },
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
  movieScreen:{
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
  },
  blockseat:{
    width:'90%',
    height:'70%',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:30,
  },
})
