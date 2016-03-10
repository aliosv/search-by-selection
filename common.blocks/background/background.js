/* global chrome */

/**
 * Injects script file into tab page
 * @param {Number} tabId Target tab identifier
 */
function injectContentScript(tabId) {
    chrome.tabs.executeScript(tabId, { file : 'content.js' });
}

/**
 * Calls callback for each tab of each browser window
 * @param {Function} cb Provides {Tab} object in argument
 */
function processAllTabs(cb) {
    chrome.windows.getAll({ populate : true }, function(windows) {
        windows.forEach(function(window) {
            window.tabs.forEach(cb);
        });
    });
}

// plugin enable/disable/update
processAllTabs(function(tab) {
    // "reload" content script
    injectContentScript(tab.id);
});

// when page reloaded
chrome.tabs.onUpdated.addListener(function(id, status) {
    if(status.status === 'complete') injectContentScript(id);
});

// response to client request
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request === 'echo') sendResponse(true);
});
