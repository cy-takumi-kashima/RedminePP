// ビュー監視のために使うタイマーのIDと回数
var timerId = null;
var timerCount = 0;

// Redmineかどうか
var isRedmine = function() {
    var metaList = document.querySelectorAll('meta');
    var isRedmine = false;
    for (var i = 0; i < metaList.length; i++) {
	var meta = metaList[i];
	if (meta.name === "description" &&
	    meta.content === "Redmine") {
	    isRedmine = true;
	    break;
	}
    }
    return isRedmine;
}

// セレクトボックスを検索ボックスに替える
var updateSearchbox = function() {
    if (document.querySelector('#searchInput')) {
	return;
    }

    // optionを連想配列に変換する // nameToId["Takumi Kashima"] = 123;
    var optionList = document.querySelectorAll('#issue_assigned_to_id option');
    var nameToId = {};
    for (var i = 0; i < optionList.length; i++) {
	var option = optionList[i];
        var name = option.text;
        var id = option.value;
        nameToId[name] = id;
    }

    // 関係者のみのラベルとボックスを削除する
    var onlyConcerned = document.querySelector('#only_concerned');
    if (onlyConcerned) {
	onlyConcerned.parentNode.removeChild(onlyConcerned);
    }
    var onlyConcernedLabel = document.querySelector('label[for=only_concerned]');
    if (onlyConcernedLabel) {
	onlyConcernedLabel.parentNode.removeChild(onlyConcernedLabel);
    }

    // セレクトボックスを取得して削除する
    var selectbox = document.querySelector('#issue_assigned_to_id');
    var baseNode = selectbox.parentNode;
    baseNode.removeChild(selectbox);
    
    // セレクトボックスの変わりに送信する隠れボックスを作る
    var sendInput = document.createElement('input');
    sendInput.setAttribute('type', 'hidden');
    sendInput.setAttribute('name', selectbox.name);
    sendInput.setAttribute('value', '');
    baseNode.appendChild(sendInput);

    // 入力で選択できる検索ボックスを作る
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('value', '');
    searchInput.setAttribute('autocomplete', 'on');
    searchInput.setAttribute('list', 'assigned_list');
    searchInput.setAttribute('id', 'searchInput');
    searchInput.addEventListener('input', function() {
        // 入力された値が正しくなければここまで
        if (!(searchInput.value in nameToId)) {
	    sendInput.setAttribute('value', '');
	    return;
	}
	// IDを設定する
	var assignedId = nameToId[searchInput.value];
	sendInput.setAttribute('value', assignedId);
    }, false);
    baseNode.appendChild(searchInput);

    // 検索候補のdatalistを作る
    var dataList = document.createElement('datalist');
    dataList.setAttribute('id', 'assigned_list');

    var isMatch = false;
    for (var i = 0; i < optionList.length; i++) {
	var assigned = optionList[i];
        var assignedId = assigned.value;
        var name = assigned.text;
	var option = document.createElement('option');
	option.setAttribute('value', name);
	option.text = assignedId;
	// 選択ボックスで既に選ばれている人がいる時
	if (isMatch === false &&
	    assigned.value !== '' &&
	    selectbox.value === assigned.value) {
	    // 検索ボックスと送信ボックスにデータを入れる
	    searchInput.setAttribute('value', name);
	    sendInput.setAttribute('value', assignedId);
	    isMatch = true;
	}
	dataList.appendChild(option);
    }
    baseNode.appendChild(dataList);
}

// 検索に切り替えるボタンをつける
var addInsertSearchboxButton = function() {
    var insertButton = document.createElement('img');
    insertButton.setAttribute('src', '/themes/redmine_theme_farend_fancy/images/add.png');
    insertButton.setAttribute('style', 'vertical-align: middle;');
    insertButton.addEventListener('click', function(e) {
        insertButton.parentNode.removeChild(insertButton);
        updateSearchbox();
    }, false);
    insertButton.setAttribute('id', 'insert_searchbox_button');
    var selectbox = document.querySelector('#issue_assigned_to_id');
    selectbox.parentNode.appendChild(insertButton);
}

var updateInsertSearchboxButton = function() {
    timerCount = 0;
    timerId = setInterval(function() {
	    var insertSearchboxButton = document.querySelector('#insert_searchbox_button');
	    console.log(insertSearchboxButton);
	    if (timerId && (!insertSearchboxButton || 10 <= timerCount)) {
		// 検索に切り替えるボタンがなくなったのでつける
		addInsertSearchboxButton();
		// タイマーをとめる
		clearInterval(timerId);
		timerId = null;

		updateSelectButtonChangeEvent();
	    }
	    timerCount += 1;
    }, 1000);    
}

// セレクトボックスが更新されるとビューが変わるので対応する    
var updateSelectButtonChangeEvent = function() {
    var selectIssueTrackerList = document.querySelectorAll('#issue_tracker_id');
    for (var i = 0; i < selectIssueTrackerList.length; i++) {
	var selectIssueTracker = selectIssueTrackerList[i];
	selectIssueTracker.addEventListener('change', updateInsertSearchboxButton);    
    }

    var selectIssueStatusList = document.querySelectorAll('#issue_status_id');
    for (var i = 0; i < selectIssueStatusList.length; i++) {
	var selectIssueStatus = selectIssueStatusList[i];
	selectIssueStatus.addEventListener('change', updateInsertSearchboxButton);    
    }
}

var main = function() {
    // Redmineではない時はここまで
    if (!isRedmine()) {
	console.log('Redmineではありません');
	return;
    }

    console.log('Redmineであることを確認しました');

    // セレクトボックスが更新されるとビューが変わるので対応する    
    updateSelectButtonChangeEvent();
 
    // 検索に切り替えるボタンをつける
    addInsertSearchboxButton();
}

main();
