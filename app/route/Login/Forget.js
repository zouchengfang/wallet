import React from 'react';
import { connect } from 'react-redux'
import {Dimensions,DeviceEventEmitter,InteractionManager,ListView,StyleSheet,View,RefreshControl,Text,ScrollView,Image,Platform,StatusBar,TextInput,TouchableOpacity} from 'react-native';
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import UColor from '../../utils/Colors'
import Button from  '../../components/Button'
import Item from '../../components/Item'
import Icon from 'react-native-vector-icons/Ionicons'
import UImage from '../../utils/Img'
import { EasyLoading } from '../../components/Loading';
import { EasyToast } from '../../components/Toast';
import { EasyDialog } from '../../components/Dialog'
import {kapimg} from '../../utils/Api'
import Constants from '../../utils/Constants'

var ScreenWidth = Dimensions.get('window').width;
var tick=60;
var dismissKeyboard = require('dismissKeyboard');
@connect(({login}) => ({...login}))
class Forget extends React.Component {

  static navigationOptions = {
    title: '忘记密码'
  };

  state = {
    phone:"",
    password:"",
    code:"",
    capture:'获取验证码',
    img:Constants.rootaddr+kapimg,
    kcode:"",
  }

  constructor(props) {
    super(props);
  }

  regSubmit = () =>{
    if(this.state.phone==""){
      EasyToast.show('请输入手机号');
      return;
    }
    if(this.state.code==""){
      EasyToast.show('请输入验证码');
      return;
    }
    if(this.state.password==""){
      EasyToast.show('请输入密码');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    EasyLoading.show('修改中...');
    this.props.dispatch({type:'login/changePwd',payload:{phone:this.state.phone,password:this.state.password,code:this.state.code},callback:(data)=>{
      EasyLoading.dismis();
      if(data.code==0){
        EasyToast.show("修改成功");
        this.props.navigation.goBack();
      }else{
        EasyToast.show(data.msg);
      }
    }})
  }


  refresh = () =>{
    EasyDialog.dismis();
    this.kcaptrue();
  }

  loaderror = () =>{
    EasyToast.show('操作过于频繁，为保障用户安全，请一小时后尝试');
  }

  kcaptrue = () =>{
    if(this.state.phone==""){
      EasyToast.show('请输入手机号');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.capture!="获取验证码"){
      return;
    }
    let img = Constants.rootaddr+kapimg+this.state.phone+"?v="+Math.ceil(Math.random()*100000);

    const view = 
      <View style={styles.countout}>
          <Button onPress={()=>{this.refresh()}}>
             <Image onError={(e)=>{this.loaderror()}} style={styles.countimg} source={{uri:img}} />
          </Button>
          <TextInput autoFocus={true} onChangeText={(kcode) => this.setState({kcode})} returnKeyType="go" 
              selectionColor={UColor.tintColor} keyboardType="ascii-capable"  style={styles.countinpt} 
              placeholderTextColor={UColor.arrow} placeholder="请输入计算结果" underlineColorAndroid="transparent" maxLength={8}
          />
      </View>
  
      EasyDialog.show("计算结果",view,"获取","取消",()=>{
      
      if(this.state.kcode==""){
        EasyToast.show('请输入计算结果');
        return;
      }

      this.getCapture();

    },()=>{EasyDialog.dismis()});
  }

  getCapture = () =>{
    if(this.state.phone==""){
      EasyToast.show('请输入手机号');
      return;
    }
    if(this.state.phone.length!=11){
      EasyToast.show('请输入11位手机号');
      return;
    }
    if(this.state.kcode==""){
      EasyToast.show('请输入验证码');
      return;
    }
    if(this.state.capture!="获取验证码"){
      return;
    }
  
    var th = this;

    EasyLoading.show('获取中...');
    this.props.dispatch({type:'login/getCapture',payload:{phone:this.state.phone,code:this.state.kcode},callback:(data)=>{
        EasyLoading.dismis();
        if(data.code==0){
          EasyToast.show("验证码已发送，请注意查收");
          th.setState({capture:"60s"})
          th.doTick();
          EasyDialog.dismis();
        }else{
          EasyToast.show(data.msg);
          if(data.code!=505){
            EasyDialog.dismis();
          }
        }
    }});
  }


  doTick = () =>{
    var th = this;
    setTimeout(function(){
      if(tick==0){
        tick=60;
        th.setState({capture:"获取验证码"})
      }else{
        tick--;
        th.setState({capture:tick+"s"})
        th.doTick();
      }
    },1000);
  }

  clearFoucs = () =>{
    this._rpass.blur();
    this._rphone.blur();
    this._rcode.blur();
  }

  dismissKeyboardClick() {
    dismissKeyboard();
  }

  render() {
    return <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
            <TouchableOpacity activeOpacity={1.0} onPress={this.dismissKeyboardClick.bind(this)}>
              <View style={styles.outsource}>
                <View style={styles.phoneoue} >
                    <Text style={styles.texttitle}> 手机号</Text>
                    <TextInput ref={(ref) => this._rphone = ref}  value={this.state.phone}  returnKeyType="next" 
                      selectionColor={UColor.tintColor} style={styles.textinpt}  placeholderTextColor={UColor.arrow}
                      placeholder="输入手机号" underlineColorAndroid="transparent" keyboardType="phone-pad" maxLength={11}
                      onChangeText={(phone) => this.setState({phone})}
                    />
                </View>
                <View style={styles.separate}></View>
                <View style={styles.codeoutsource}>
                    <View style={styles.codeout} >
                        <Text style={styles.texttitle}> 验证码</Text>
                        <TextInput  value={this.state.code} ref={(ref) => this._rcode = ref}  returnKeyType="next" 
                          selectionColor={UColor.tintColor} style={styles.textinpt}  placeholderTextColor={UColor.arrow} 
                          placeholder="输入验证码" underlineColorAndroid="transparent" keyboardType="phone-pad" maxLength={6}
                          onChangeText={(code) => this.setState({code})}
                        />
                    </View>
                    <View style={styles.btnoutsource}>
                      <Button onPress={() => this.kcaptrue()}>
                        <View style={styles.btnout}>
                          <Text style={styles.btntext}>{this.state.capture}</Text>
                        </View>
                      </Button>
                    </View>
                </View>
                <View style={styles.separate}></View>
                <View style={styles.phoneoue} >
                    <Text style={styles.texttitle}> 设置新密码</Text>
                    <TextInput ref={(ref) => this._rpass = ref}  value={this.state.password} returnKeyType="next" 
                      selectionColor={UColor.tintColor} style={styles.textinpt}  placeholderTextColor={UColor.arrow} 
                      placeholder="输入密码"  underlineColorAndroid="transparent" secureTextEntry={true} maxLength={20}
                      onChangeText={(password) => this.setState({password})}
                    />
                </View>
              </View>
              <Button onPress={() => this.regSubmit()}>
                <View style={styles.referbtn}>
                  <Text style={styles.refertext}>提交</Text>
                </View>
              </Button>
          </TouchableOpacity>
      </ScrollView>
  </View>
  }
}

const styles = StyleSheet.create({
  countout: {
    flexDirection:'row'
  },
  countimg: {
    width:100,
    height:45
  },   
  countinpt: {
    color: UColor.tintColor,
    marginLeft: 10,
    width: 120,
    height: 45,
    fontSize: 15,
    backgroundColor: '#EFEFEF'
  },


  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: UColor.secdColor,
  },
  
  outsource: {
    backgroundColor: UColor.secdColor,
    flex: 1,
    flexDirection: 'column',
  },
  phoneoue: {
    padding:20,
    height:80,
    backgroundColor: UColor.mainColor
  },

  texttitle:{
    fontSize:12,
    color: UColor.arrow
  },
  codeoutsource: {
    flexDirection:'row',
    backgroundColor: UColor.mainColor
  },
  codeout: {
    padding: 20,
    height: 80,
    width: 200
  },

  phonetitle: {
    fontSize:12,
    color: UColor.arrow
  },
  textinpt: {
    color: UColor.arrow,
    fontSize: 15,
    height: 40,
    paddingLeft: 2
  },
  btnoutsource: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'center',
    justifyContent: "flex-end",
    marginRight: 10
  },
  btnout: {
    backgroundColor: UColor.tintColor,
    borderRadius: 5,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btntext: {
    fontSize:12,
    color: UColor.fontColor
  },
  separate: {
    height: 0.5,
    backgroundColor: UColor.secdColor
  },

  referbtn: {
    height: 45,
    backgroundColor: UColor.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 5
  },
  refertext: {
    fontSize:15,
    color: UColor.fontColor
  }


});

export default Forget;
