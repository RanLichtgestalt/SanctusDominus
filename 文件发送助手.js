// ==UserScript==
// @name         文件助手
// @author       RR
// @version      2.0.0
// @description  让骰娘给你发送文件，支持多个文件，可在海豹内置里增加文件，但通用的绝对路径需要在插件里修改。ps：我讨厌http地址，配置协议项可在海豹内置中修改
// @license      MIT
// @homepageURL  哇达西没有喵
// ==/UserScript==

(() => {
    const GROUP_FILE_API = "/upload_group_file";
    const PRIVATE_FILE_API = "/upload_private_file";
    const BASE_FILE_PATH = "/root/RR/data/filebox"; //这里修改成你自己的文件夹路径

    /**
     * 从文件路径中提取文件名
     */
    function extractFileName(filePath) {
        try {
            const pathParts = filePath.split(/[\\/]/);
            return pathParts[pathParts.length - 1];
        } catch (error) {
            console.error("提取文件名失败", error);
            return filePath;
        }
    }

    /**
     * 构建完整的文件路径
     */
    function buildFilePath(fileName) {
        // 如果已经是完整路径，直接返回
        if (fileName.startsWith('/')) {
            return fileName;
        }
        // 否则拼接基础路径
        return `${BASE_FILE_PATH}/${fileName}`;
    }

    /**
     * 测试Napcat连接
     */
    function testNapcatConnection(apiUrl, token) {
        console.log("测试Napcat连接...");
        
        return fetch(apiUrl + "/get_status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        })
        .then(response => {
            console.log(`连接测试响应状态: ${response.status}`);
            if (response.ok) {
                return response.json().then(data => {
                    console.log("Napcat连接测试成功:", data);
                    return { success: true, data };
                });
            } else {
                return response.text().then(text => {
                    console.error("Napcat连接测试失败:", text);
                    return { success: false, error: `HTTP ${response.status}: ${text}` };
                });
            }
        })
        .catch(error => {
            console.error("Napcat连接测试异常:", error);
            return { success: false, error: error.message };
        });
    }

    /**
     * 上传文件的通用函数
     */
    function uploadFile(apiUrl, authorization, apiPath, filePath, targetId, idKey) {
        const fileName = extractFileName(filePath);
        const payload = {
            [idKey]: parseInt(targetId),
            name: fileName,
            file: filePath
        };

        console.log(`上传文件API: ${apiUrl + apiPath}`);
        console.log("请求数据:", JSON.stringify(payload, null, 2));
        console.log("认证Token:", authorization ? "已设置" : "未设置");

        // 准备请求头
        const headers = {
            "Content-Type": "application/json"
        };
        
        if (authorization && authorization.trim() !== "") {
            headers["Authorization"] = `Bearer ${authorization.trim()}`;
        }

        return fetch(apiUrl + apiPath, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        })
        .then(response => {
            console.log(`HTTP响应状态: ${response.status} ${response.statusText}`);
            
            // 尝试获取响应内容，无论状态码如何
            return response.text().then(text => {
                let jsonData = null;
                try {
                    jsonData = JSON.parse(text);
                } catch (e) {
                    // 如果不是JSON，保持文本格式
                }
                
                if (!response.ok) {
                    console.error(`HTTP错误详情:`, text);
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }
                
                return jsonData || text;
            });
        })
        .then(data => {
            const uploadType = apiPath === GROUP_FILE_API ? "群" : "私聊";
            console.log(`执行${uploadType}文件上传成功：`, data);
            return { success: true, data };
        })
        .catch(error => {
            console.error("文件上传操作失败:", error);
            if (error instanceof TypeError) {
                return { 
                    success: false, 
                    error: "网络连接问题，请检查：\n1. Napcat服务是否运行\n2. 协议端地址是否正确\n3. 网络连接是否正常" 
                };
            } else {
                return { 
                    success: false, 
                    error: `文件上传失败: ${error.message}` 
                };
            }
        });
    }

    /**
     * 上传群文件
     */
    function uploadGroupFile(apiUrl, groupId, filePath, authorization = "") {
        const cleanGroupId = groupId.match(/\d+/)[0];
        return uploadFile(apiUrl, authorization, GROUP_FILE_API, filePath, cleanGroupId, "group_id");
    }

    /**
     * 上传私聊文件
     */
    function uploadPrivateFile(apiUrl, userId, filePath, authorization = "") {
        const cleanUserId = userId.match(/\d+/)[0];
        return uploadFile(apiUrl, authorization, PRIVATE_FILE_API, filePath, cleanUserId, "user_id");
    }

    /**
     * 初始化插件
     */
    function initializePlugin() {
        let extension = seal.ext.find("文件发送助手");
        
        if (!extension) {
            extension = seal.ext.new("文件发送助手", "RR", "2.0.0");
            seal.ext.register(extension);
            
            seal.ext.registerStringConfig(extension, "协议端 http 地址", "http://127.0.0.1:8096"); // 这个东西就是在折磨我
            seal.ext.registerStringConfig(extension, "协议端 token", "");
            seal.ext.registerBoolConfig(extension, "是否允许私聊使用", true);
            
            // 文件列表模板配置
            seal.ext.registerTemplateConfig(
                extension, 
                "文件列表", 
                [
                    '{"文件名":"coc角色卡","实际文件名":"coc角色卡.xlsx"}',
                    '{"文件名":"fu角色卡","实际文件名":"fu角色卡.xlsx"}',
                    '{"文件名":"圣杯角色卡","实际文件名":"圣杯v1.76.3自动卡.xlsx"}',
                    '{"文件名":"圣杯规则","实际文件名":"圣杯规则v4.2.4.pdf"}',
                    '{"文件名":"极简杯规则","实际文件名":"极简杯跑团规则v1.6.7（普清版）.pdf"}'
                ]
            );
        }

        /**
         * 获取文件列表并显示
         */
        function showFileList(context, message) {
            const fileListConfig = seal.ext.getTemplateConfig(extension, "文件列表");
            let fileNames = [];
            
            try {
                fileNames = fileListConfig.map(item => {
                    const fileInfo = JSON.parse(item);
                    return fileInfo.文件名;
                });
            } catch (error) {
                console.error("解析文件列表出错", error);
                seal.replyToSender(context, message, "文件列表配置有误，请联系骰主检查");
                return false;
            }
            
            seal.replyToSender(
                context, 
                message, 
                `📁 烟雾镜挥了挥手，从黑雾中显现下列文件：\n${fileNames.map(name => `• ${name}`).join('\n')}\n\n` +
                `共计 ${fileNames.length} 个文件\n` +
                `使用"烟雾镜给我[文件名]"来获取文件，例如：烟雾镜给我coc角色卡`
            );
            
            return true;
        }

        /**
         * 发送指定文件
         */
        function sendFile(context, message, requestedFileName) {
            const apiUrl = seal.ext.getStringConfig(extension, "协议端 http 地址");
            const token = seal.ext.getStringConfig(extension, "协议端 token");
            const allowPrivate = seal.ext.getBoolConfig(extension, "是否允许私聊使用");
            const fileListConfig = seal.ext.getTemplateConfig(extension, "文件列表");

            console.log(`开始查找文件: ${requestedFileName}`);
            console.log(`API地址: ${apiUrl}`);
            console.log(`Token: ${token ? "已设置" : "未设置"}`);
            console.log(`允许私聊: ${allowPrivate}`);
            console.log(`消息来源: ${context.isPrivate ? "私聊" : "群聊"}`);

            if (!apiUrl || apiUrl.trim() === "") {
                seal.replyToSender(context, message, "错误：协议端地址未配置，请联系骰主检查设置");
                return { success: false };
            }

            let matchedFile = null;
            for (let i = 0; i < fileListConfig.length; i++) {
                try {
                    const fileConfig = JSON.parse(fileListConfig[i]);
                    console.log(`检查文件配置 ${i}: ${fileConfig.文件名}`);
                    
                    if (requestedFileName.includes(fileConfig.文件名) || 
                        fileConfig.文件名.includes(requestedFileName)) {
                        
                        console.log(`找到匹配的文件: ${fileConfig.文件名}`);
                        matchedFile = fileConfig;
                        break;
                    }
                } catch (error) {
                    console.error(`解析文件配置出错 (索引 ${i})`, error);
                }
            }

            if (!matchedFile) {
                console.log(`未找到匹配的文件: ${requestedFileName}`);
                seal.replyToSender(context, message, `未找到文件"${requestedFileName}"，请使用"烟雾镜，文件夹"查看可用文件列表`);
                return { success: false };
            }

            const fullFilePath = buildFilePath(matchedFile.实际文件名);
            console.log(`完整文件路径: ${fullFilePath}`);
            
            // 执行文件上传
            if (context.isPrivate) {
                if (!allowPrivate) {
                    seal.replyToSender(context, message, "骰主已禁用私聊使用，请在群聊中使用。");
                    return { success: false };
                }
                console.log("执行私聊文件上传");
                return uploadPrivateFile(apiUrl, context.player.userId, fullFilePath, token);
            } else {
                console.log("执行群聊文件上传");
                return uploadGroupFile(apiUrl, context.group.groupId, fullFilePath, token);
            }
        }

        /**
         * 处理自然语言指令
         */
        function processNaturalLanguageCommand(context, message) {
            const messageText = message.message.trim();
            
            if (messageText === "烟雾镜，文件夹" || messageText === "烟雾镜,文件夹") {
                showFileList(context, message);
                return true;
            }
            
            const givePattern = /^烟雾镜给我(.+)$/;
            const match = messageText.match(givePattern);
            
            if (match) {
                const requestedFileName = match[1].trim();
                
                if (requestedFileName === "") {
                    seal.replyToSender(context, message, '请指定要获取的文件名，使用"烟雾镜，文件夹"查看可用文件列表');
                    return true;
                }
                
                seal.replyToSender(context, message, `特斯卡特利波卡正在烟雾中翻找：${requestedFileName}...`);
                
                // 发送文件
                const result = sendFile(context, message, requestedFileName);
                
                if (result && result.then) {
                    result.then(uploadResult => {
                        if (uploadResult.success) {
                            const chatType = context.isPrivate ? "私聊" : "群聊";
                            seal.replyToSender(
                                context, 
                                message, 
                                `文件"${requestedFileName}"发送成功！\n神期待你为他准备的试炼演出。`
                            );
                        } else {
                        
                            let errorMsg = uploadResult.error;
                            if (errorMsg.includes("HTTP 500")) {
                                errorMsg += "\n可能原因：\n1. Napcat服务未正常运行\n2. 文件路径不存在\n3. Token认证失败\n请检查Napcat服务状态和配置。";
                            }
                            seal.replyToSender(context, message, errorMsg);
                        }
                    });
                }
                return true;
            }
            
            return false;
        }

        // 处理非命令消息
        extension.onNotCommandReceived = (context, message) => {
            processNaturalLanguageCommand(context, message);
        };
        
        console.log("文件助手插件已加载 - 版本 2.0.0");
        console.log("增加了连接测试和更好的错误处理");
        
        // 插件加载后测试Napcat连接
        setTimeout(() => {
            const apiUrl = seal.ext.getStringConfig(extension, "协议端 http 地址");
            const token = seal.ext.getStringConfig(extension, "协议端 token");
            
            if (apiUrl && apiUrl.trim() !== "") {
                console.log("执行Napcat连接测试...");
                testNapcatConnection(apiUrl, token).then(result => {
                    if (!result.success) {
                        console.error("Napcat连接测试失败，文件发送功能可能无法正常工作");
                        console.error("错误详情:", result.error);
                    }
                });
            }
        }, 2000);
    }

    // 启动插件
    initializePlugin();
})();