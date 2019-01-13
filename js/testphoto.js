//区域滚动,需手动初始化scroll控件
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
(function($) {
	$('#scroll').scroll({
		indicators: false //是否显示滚动条
	});

})(mui);
//mui.init({
//	swipeBack: true, //启用右滑关闭功能
//	gestureConfig: {
//		doubletap: true, //默认为false
//		longtap: true, //默认为false
//
//	}
//});

mui.plusReady(function() {

	//获取url参数值
	function geturl(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	var xmid = geturl("id");
	var CityName = geturl("CityName");
	var ysbw = geturl("jcbw"); //检查部位
	var ysrq = geturl("jcrq"); //检查日期
	var mc = geturl("mc");
	var sjc = geturl("timestamp");
	var checkId = geturl("checkId");
	var gcmc = geturl("gcmc");
	//	alert(checkId);
	//      alert(sjc)
	ysbw = decodeURI(ysbw);
	gcmc = decodeURI(gcmc);
	CityName = decodeURI(CityName); //转码成中文
	//	alert(CityName)
	mc = decodeURI(mc);
	//				alert(xmid+"  "+mc+"  "+sjc); 
	var a1 = document.getElementById('a1');

	var mc = document.getElementById("mc"); //姓名
	var jcbw = document.getElementById("jcbw"); //检查部位
	var jcrq = document.getElementById("jcrq"); //检查日期
	var jcry = document.getElementById("jcry"); //检查人员
	var sgbz = document.getElementById("sgbz"); //施工班组
	var zzxm = document.getElementById("zzxm"); //组长姓名
	var lxdh = document.getElementById("lxdh"); //联系电话
	var sgrq = document.getElementById("sgrq"); //施工日期
	var gzms = document.getElementById("gzms"); //工作描述

	var save = document.getElementById('save'); //保存按钮
	//	var fjck = document.getElementById('fjck'); //附件查看
	var fjscxg = document.getElementById('fjscxg'); //附件上传/修改

	var myform = document.getElementById('myform'); //基本信息
	var uploader = document.getElementById('uploader'); //上传附件

	var my_popover = document.getElementById('my_popover'); //右上角按钮
	var plsr = document.getElementById('plsr'); //批量按钮

	var bhao = document.getElementById('bhao'); //编号
	var cdlx = document.getElementById('cdlx'); //测点类型
	var scz = document.getElementById('scz'); //实测值
	var scgbi = document.getElementById('scgbi'); //关闭
	var scqding = document.getElementById('scqding'); //确定

	var mydiv = document.getElementById('mydiv'); //测点布置图
	var kbbhao = document.getElementById('kbbhao'); //测点编号
	var kbcdlx = document.getElementById('kbcdlx'); //测点类型
	var kbscz = document.getElementById('kbscz'); //实测值
	var kbgbi = document.getElementById('kbgbi'); //关闭
	var kbqding = document.getElementById('kbqding'); //确定

	var xztp = document.getElementById("xztp"); //选择图片
	var qkbz = document.getElementById('qkbz'); //清空布置
	var bcbz = document.getElementById('bcbz'); //保存布置
	var yjbz = document.getElementById('yjbz'); //一键布置
	var out = document.getElementById('out'); //操作
	var jp = document.getElementById("jp"); //截屏布点
	var jccd = new Array(); //检测被隐藏的span1
	var zhtj = document.getElementById("zhtj");
	//监听upload_camera,打开原生操作列表
	var upload_camera = document.getElementById('upload_camera');

	//基本信息，读数据
	var cdfj = [];

	var camera = upload_camera.getElementsByClassName('upload_camera');
	//				alert(camera.length);

	//拍照处理
	for(var i = 0; i < camera.length; i++) {
		camera[i].addEventListener('tap', function() {
			myactionSheet('yszp');
		});
	}

	var myactionSheet = function(lx) {
		var btnArray = [{
			title: "拍照"
		}, {
			title: "相册"
		}];
		plus.nativeUI.actionSheet({
			title: "操作",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			var text = "你刚点击了\"";
			switch(index) {
				case 0:
					text += "取消";
					break;
				case 1:
					getImage(lx);
					text += "拍照";
					break;
				case 2:
					galleryImg(lx);
					text += "相册";
					break;
			}
			//info.innerHTML = text+"\"按钮";
		});
	};

});

//上传文件
var i = 1,
	gentry = null,
	w = null;
var hl = null,
	le = null,
	de = null,
	ie = null;
var unv = true;
// H5 plus  上传照片 事件处理
function plusReady_camera() {
	
	// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL("_doc/", function(entry) {
		entry.getDirectory("camera/fhys", {
			create: true
		}, function(dir) {
			gentry = dir;
			//updateHistory();
		}, function(e) {
			outSet("Get directory \"camera\fhys\" failed: " + e.message);
		});
	}, function(e) {
		outSet("Resolve \"_doc/\" failed: " + e.message);
	});
}
if(window.plus) {
	plusReady_camera();
} else {
	document.addEventListener("plusready", plusReady_camera, false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded", function() {
	// 获取DOM元素对象
	//验收照片
	hl_yszp = document.getElementById("history_yszp");
	le_yszp = document.getElementById("empty_yszp");

	de = document.getElementById("display");
	if(ie = document.getElementById("index")) {
		ie.onchange = indexChanged;
	}
	// 判断是否支持video标签
	unv = !document.createElement('video').canPlayType;
}, false);

//选择前后摄像头
function changeIndex() {
	outSet("选择摄像头：");
	ie.focus();
}

function indexChanged() {
	de.innerText = ie.options[ie.selectedIndex].innerText;
	i = parseInt(ie.value);
	outLine(de.innerText);
}

// 拍照函数
function getImage(lx) {
	outSet("开始拍照：");
	var cmr = plus.camera.getCamera(); //获取摄像头管理对象	
	//进行拍照操作cmr.captureImage( successCB, errorCB, option );
	cmr.captureImage(function(p) {
		outLine("成功：" + p);
		// resolveLocalFileSystemURL(url,succesCB,errorCB )通过URL参数获取目录对象或文件对象
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			createItem(p, entry, lx);
		}, function(e) {
			outLine("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
		outLine("失败：" + e.message);
	}, {
		filename: "_doc/camera/fhys/",
		index: 1
	});
}

// 从相册中选择图片
function galleryImg(lx) {
	// 从相册中选择图片
	outSet("从相册中选择图片:");
	plus.gallery.pick(function(path) {
		outLine(path);
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			createItem(path, entry, lx);
		}, function(e) {
			outLine("读取拍照文件错误：" + e.message);
		});
		//showImg( path );
		//createItem(path);
	}, function(e) {
		outSet("取消选择图片");
	}, {
		filter: "image"
	});
}

// 显示文件
function displayFile(li) {
	if(w) {
		outLine("重复点击！");
		return;
	}
	if(!li || !li.entry) {
		ouSet("无效的媒体文件");
		return;
	}
	var name = li.entry.name;
	var suffix = name.substr(name.lastIndexOf('.'));
	var url = "";
	if(suffix == ".mov" || suffix == ".3gp" || suffix == ".mp4" || suffix == ".avi") {
		//if(unv){plus.runtime.openFile("_doc/camera/"+name);return;}
		url = "camera_video.html";
	} else {
		url = "camera_image.html";
	}
	w = plus.webview.create(url, url, {
		hardwareAccelerated: true,
		scrollIndicator: 'none',
		scalable: true,
		bounce: "all"
	});
	w.addEventListener("loaded", function() {
		w.evalJS("loadMedia('" + li.entry.toLocalURL() + "')");
		//w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
	}, false);
	w.addEventListener("close", function() {
		w = null;
	}, false);
	w.show("pop-in");
}

// 添加播放项
var index;
var index_yszp = 1;
var index_hxpmt = 1;
var index_ysjl = 1;
var index_bcjl = 1;

function createItem(p, entry, lx) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute("onclick", "displayFile(this);");
	if(lx == 'yszp') {
		hl = hl_yszp;
		le = le_yszp;
		files_yszp.push({
			name: "upfile" + index_yszp,
			path: p
		});
		index_yszp++;
	} else {

	}
	hl.insertBefore(li, le.nextSibling);
	//	alert(entry.name);
	li.querySelector(".aname").innerText = entry.name;
	//	alert(entry.name);
	li.querySelector(".ainf").innerText = "...";
	li.entry = entry;
	updateInformation(li);
	// 设置空项不可见
	le.style.display = "none";
}
// 获取录音文件信息
function updateInformation(li) {
	if(!li || !li.entry) {
		return;
	}
	var entry = li.entry;
	entry.getMetadata(function(metadata) {
		li.querySelector(".ainf").innerText = dateToStr(metadata.modificationTime);
	}, function(e) {
		outLine("获取文件\"" + entry.name + "\"信息失败：" + e.message);
	});
}
// 获取录音历史列表
function updateHistory() {
	if(!gentry) {
		return;
	}
	var reader = gentry.createReader();
	reader.readEntries(function(entries) {
		for(var i in entries) {
			if(entries[i].isFile) {
				createItem(entries[i]);
			}
		}
	}, function(e) {
		outLine("读取录音列表失败：" + e.message);
	});
}

// 清除历史记录
function cleanHistory(lx) {
	var btnArray = ['确定', '取消'];
	mui.confirm('您确定要清空记录吗？', '警告:', btnArray, function(e) {
		if(e.index == 0) {
			if(lx == 'yszp') {
				hl_yszp.innerHTML = '<li id="empty_yszp" class="ditem-empty">无历史记录</li>';
				le_yszp = document.getElementById("empty_yszp");
				files_yszp = [];
				index_yszp = 1;
			} else {

			}

			// 删除音频文件
			outSet("清空拍照录像历史记录：ok");
		} else {
			//info.innerText = '取消';
			return;
		}
	});
}

/*----------上传----------*/
var server = url + "fileupload.php";
//var server="http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
var files = [];
var files_yszp = [];

function upload(lx, clean) {
	//获取url参数值
	function geturl(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	var sjc = "111111";
//	var xmid = geturl("gcid");
//	var mc = geturl("mc");
//	var gclb = geturl("gclb");
//	var checkId = geturl("checkId");
	var sclb;
//	gclb = decodeURI(gclb);
//	mc = decodeURI(mc);
//					alert(sjc);
	if(lx == 'yszp') {
		files = files_yszp;
	} else {

	}
	if(files.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	outSet("开始上传：")
	var wt = plus.nativeUI.showWaiting(); //显示系统等待对话框
	var task = plus.uploader.createUpload(server, {
		method: "POST"
	}, function(t, status) {
		//上传完成
		if(status == 200) {
			outLine("上传成功：" + t.responseText);
			wt.close();
			var button_lx = document.getElementById(lx);
			var button_clean = document.getElementById(clean);
			//			alert("上传成功!"+t.responseText);
			alert("上传成功!");
		} else {
			outLine("上传失败：" + status);
			wt.close();
		}
		window.location.reload(); //刷新页面
	}); //新建上传任务
	//				alert(sjc);
	//添加上传数据 
	//	task.addData("lx", lx);
	task.addData("uid", getUid());
	nub = files.length.toString();
	task.addData("nub", nub);
	task.addData("sjc", sjc);
	//	task.addData("xmid", xmid);
	//	task.addData("gclb", gclb);
	//	task.addData("mc", mc);
	//	task.addData("checkId", checkId);
	//	task.addData("sclb", '实测实量');
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, {
			key: f.name
		}); //添加上传文件 path为路径
	}
	task.start();
	files = [];
}

// 产生一个随机数
function getUid() {
	return Math.floor(Math.random() * 100000000 + 10000000).toString();
}