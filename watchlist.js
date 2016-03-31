'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ListView,
  ScrollView,
  RefreshControl,
  ActivityIndicatorIOS
} from 'react-native';  

class Watchlist extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return (
      <React.NavigatorIOS
        style={styles.wrapper}
        barTintColor= '#48BBEC'
        initialRoute={{
          title: 'Watchlist',
          component: WatchlistInner,
          passProps: {info: this.props.info}
        }} />
    )
  }
} 

class WatchlistInner extends Component {
	constructor(props) {
		super(props);
		this.state ={
			dataSource: new ListView.DataSource({
			rowHasChanged: (r1,r2) => r1 != r2
		}),
			loaded: false

		};
	}
	renderRow(rowData){
		return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        borderColor: '#D7D7D7',
        borderBottomWidth: 1,

      }}>
      <Text style={{
				color: '#333',
				backgroundColor:'white',
				textAlign: 'center',
        flex: 1
        
			}}>
			{rowData[0]} 
			</Text>
      <Text style={{
        color: '#333',
        backgroundColor:'white',
        flex: 1,
        textAlign: 'center'
      }}>
      {rowData[1]} 
      </Text>
      <Text style={
        color(rowData[2])
        
      }>
      {rowData[2]} 
      </Text>
      <Text style={
        percent(rowData[2])
      }>
      {rowData[3]}
      </Text>
      </View>
      )
		}
	
	render() {
		return (
          <View style ={{
            
            justifyContent: 'flex-start',
            paddingTop: 60,
            paddingBottom: 50,
            marginBottom: 10
            
          }}>
          <TouchableOpacity onPress={this._onPressButton.bind(this)}> 
            <Image style={styles.logo} source={require('./refresh.png')}/>

            
         </TouchableOpacity>
             <ListView
               dataSource={this.state.dataSource}
               initialListSize={15}
               automaticallyAdjustContentInsets={true}
               renderRow={this.renderRow.bind(this)}
               renderRow={this.renderRow.bind(this)} />
        
          </View>
			)
	}


	componentDidMount(){
		this._onPressButton();
	}


	_onPressButton(){
		
		fetch('https://portfolioio.herokuapp.com/api/watchlist/' + this.props.info.userId
			, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
         method: 'GET',
        
       }
      )
      .then((response)=> { 
      	var datas =[]
        var da = JSON.parse(response._bodyText);
        for(var key in da){
          datas.push(key)
        }
        var list ='';
        for(var i=0; i<datas.length; i++){
          list+=datas[i] + '+';
        }
        list= list.slice(0,-1);
        fetch('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sac1p2',{
        	method: 'GET'
        }
        )
        .then((response) => {

        	var results =[];
        	var stocks =[];
        	var final = [];
        	var ask = response._bodyText.toString().split('\n');
        	ask.forEach(function(item){
              results.push(item.split(','))
        	})
            results.forEach(function(stocks){
            	stocks.forEach(function(stock){
              var result1 = stock.replace(/\"/g,'');
              if(result1.match(/^[A-Z]*$/)){
              	result1 = result1
              }
	          else if(/[\%]/.test(result1)){
	            
	            var res = result1.replace(/\%/,'')
	            var sign = res[0];
	            var decimal = res.substr(1)
	            var ans = parseFloat(decimal).toFixed(2)
	            var final = sign + ans.toString()
	            result1=final.concat('%')
	          }
	          else{
	          	var other = parseFloat(result1).toFixed(2);
	          	result1 = other.toString()
	          }
              stocks.push(result1)
            })
            final.push(stocks);
            stocks=[]
            })
            var finalfinal= [];
            var final2;
            final.forEach(function(stock){
            	final2 = stock.slice(4);
            	finalfinal.push(final2)
            })
            finalfinal.pop()
            this.setState({dataSource: this.state.dataSource.cloneWithRows(finalfinal)})
        })
        response.json();
      })
	}
}

function color(number) {
  number = parseFloat(number)
  if(number >= 0){
  return {
    color: '#00cc00',
    backgroundColor: 'white',
    flex: 1,
    textAlign: 'center'
  }
}
  if(number < 0){
    return {
      color: '#ff3300',
      backgroundColor: 'white',
      flex: 1,
      textAlign: 'center'
    }
  }
}
function percent (number) {
  number = parseFloat(number)
  if(number >= 0){
  return {
    color: '#00cc00',
    backgroundColor: 'white',
    flex: 1,
    textAlign: 'center'
  }
}
  if(number < 0){
    return {
      color: '#ff3300',
      backgroundColor: 'white',
      flex: 1,
    textAlign: 'center'
    }
  }
}
  

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop:30,
    paddingBottom: 30,
    alignItems: 'center',
    
  },
  wrapper:{
    flex:1
  },
  
  logo: {
    width: 30,
    height: 20,
    margin: 4
    
  },
  header: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	backgroundColor: '#48BBEC',
  	fontSize: 20,
    paddingBottom: 10
  }

});

module.exports = Watchlist;