define(['talent'
	,'templates/common'
	,'iTalent-header'
],function(
	Talent
	,jst
	,Header
) {
	/**
	* Header view class
	* @author nobody
	* @extends {Talent.Layout}
	* @class Header
	*/
	return Talent.Layout.extend(
		/** @lends SidebarView.prototype */
	{
		template: jst['common/page-regions/header']
		,initialize:function(){
			this.headerJson = {
				companyInfo:{
					logo:"http://proto.beisen.co/prototype-v2/app/images/logo.png"
					,name:"北森集团"
					,href:"www.beisen.com"
				}
				,userInfo:{
					name : "张三张三",
					avatar: {
						color:"#f0c75a"
						,hasAvatar:false
						,small:"http://cache.tita.com/Image/110006/324d5a07a3984689a6a5304d13902567_s.png"
					}
				}
				,userInfoDropDown:[
								{
									title:"个人主页"
									,href:"javascript:void(0)"
									,target:"_self"
								}
								,{
									title:"编辑简档"
									,href:"javascript:void(0)"
									,target:"_self"
								}
								,{
									title:"个人设置"
									,href:"javascript:void(0)"
									,target:"_self"
								}
								,{
									title:"退出登录"
									,href:"javascript:void(0)"
									,target:"_self"
								}

							]
				,oprBtn:[
							{
								type:'Search'
								,iconName:"header-icon-sousuo"
								,id:""
								,title:"搜索"
								,href:"javascript:void(0)"
								,reminds:{  //关于新消息
		            				remindCount: 0//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#"//查看全部的地址
									,remindList:[]
		            			}
							}
							,{
								type:'HomePage'
								,iconName:"header-icon-chanpin"
								,id:""
								,title:"首页"
								,href:"#products"
								,reminds:{  //关于新消息
		            				remindCount: 0//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#"//查看全部的地址
									,remindList:[]
		            			}
							}
							,{
								type:'Message'
								,iconName:"header-icon-xiaoxi"
								,id:""
								,title:"通知"
								,href:"#messages"
								,reminds:{  //关于新消息
		            				remindCount:3//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#messages"//查看全部的地址
									,remindList:[
										            {
										               content:"新回复"
										               ,date:"5分钟前"
										               ,length:8
										               ,className:"header-icon-reply"
										               ,href:"#messages"
										            }
										            ,{
										               content:"@我"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-at-me" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"@部门动态"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-team-notice" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"@公告"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-at-notice" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"@项目"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-at-project" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"@团队"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-at-team" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"团队通知"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-team-notice" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"工作通知"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-work-notice" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"招聘"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-recruit" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"新粉丝"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-fans" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"收到打赏"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-in-reward" 
										               ,href:"#messages"
										            }
										            ,{
										               content:"向你讨赏"
										               ,date:"5分钟前"
										               ,length:12
										               ,className:"header-icon-ex-reward" 
										               ,href:"#messages"
										            }
									]	
		            			}
							}
							,{
								type:'Todos'
								,iconName:"header-icon-daiban"
								,id:""
								,title:"待办"
								,href:"#messages"
								,reminds:{  //关于新消息
		            				remindCount: 32//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#messages"//查看全部的地址
									,remindList:[
											{
												userName:"张庆华"
												,teskName:"请你负责任务"
												,date:"5分钟前"
												,taskContent:"视觉设计验收任务统计视觉设计验收任务统计视觉"
												,href:"#messages"
												,avatar: {
													color:"#f0c75a"
													,hasAvatar:true
													,small:"http://cache.tita.com/Image/110006/2e5c56760f494679b1c94234f89539a6_m.png"
												}
											}
											,{
												userName:"孔常柱"
												,teskName:"请你审批任务"
												,date:"5分钟前"
												,taskContent:"视觉设计验收任务统设计验收任务统计计视觉设计验收任务统计视设计验收任务统计觉设计验收任务统计"
												,href:"#messages"
												,avatar: {
													color:"#f0c75a"
													,hasAvatar:true
													,small:"http://cache.tita.com/Image/110006/b4bc3d7696e74345b3ee3cd88cd1538f_m.png"
												}
											}
											,{
												userName:"郭美山"
												,userPic:"http://cache.tita.com/Image/110006/324d5a07a3984689a6a5304d13902567_m.png"
												,date:"5分钟前"
												,taskContent:"视觉设计验收任务统计"
												,href:"#messages"
												,avatar: {
													color:"#f0c75a"
													,hasAvatar:true
													,small:"http://cache.tita.com/Image/110006/324d5a07a3984689a6a5304d13902567_s.png"
												}
											}
									]
		            			}
							}
							,{
								type:'Skin'
								,iconName:"header-icon-huanfu"
								,id:""
								,title:"换肤"
								,href:"javascript:void(0)"
								,reminds:{  //关于新消息
		            				remindCount: 0//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#"//查看全部的地址
									,remindList:[]
		            			}
							}
							,{
								type:'Settings'
								,iconName:"header-icon-shezhi"
								,id:""
								,title:"设置"
								,href:"#about"
								,reminds:{  //关于新消息
		            				remindCount: 0//是否有最新消息，默认0代表没有最新消息
									,viewAllHref:"#"//查看全部的地址
									,remindList:[]
		            			}
							}
						]
			}
		}
		,regions:{
			HeaderRegion:'#page-header-region'
		}
		,ui:{
			test:"#page-header-region"
		}
		,events: function() {
			var events = {};
			return events;
		}
		,onShow: function() {
			//实例化头部
			this.header = new Header(this.headerJson);
			//渲染
			this.HeaderRegion.show(this.header);
			$(window).on('hashchange', function() {
				//console.log('head hash change')
			})
			// //监听头部事件
			// this.listenTo(this.header,"iconOprEvents",function(resp){
			// 	console.log(resp);
			// });

			// this.listenTo(this.header,"iconClickEvent",function(resp){
			// 	console.log(resp);
			// });
		}
		
	});
});

