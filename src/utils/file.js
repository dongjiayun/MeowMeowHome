import { consoleLog } from '@/utils/index'

export function getLocalFileInfo(file_url) {
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(file_url, function(entry) {
            // 可通过entry对象操作test.html文件
            entry.file(async function(file) {
                await getLocalfileInfoBy(file).then((res) => {
                    resolve(res)
                })
            })
        },
        function(err) {
            reject(err)
        }
        )
    })
}

export function getLocalFile(cata_path) {
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(cata_path, function(entry) {
            consoleLog('read file success,file:' + JSON.stringify(entry))
            entry.file(file => {
                resolve(file)
            })
        }, function(err) {
            consoleLog(err)
            reject(err)
        })
    })
}

export function getLocalFileByFileName(path) {
    return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
            consoleLog('read file success,file:' + JSON.stringify(fs))
            fs.root.getFile(path, {
                create: true
            }, function(fileEntry) {
                fileEntry.file(function(file) {
                    consoleLog(file.size + '--' + file.name)
                    resolve(file)
                })
            })
        }, function(err) {
            consoleLog(err)
            reject(err)
        })
    })
}

export function getLocalfileInfoBy(file) {
    return new Promise((resolve, reject) => {
        var file_type = file.type
        if (file_type == 'image/png' || file_type == 'image/jpeg' || file_type == 'image/gif') {
            const file_info = {
                name: file.name,
                fullPath: file.fullPath,
                file_type: file.type,
                duration: 0,
                add_time: rTime(file.lastModifiedDate)
            }
            resolve(file_info)
        } else {
            plus.io.getVideoInfo({
                filePath: 'file://' + file.fullPath,
                success: (videoInfo) => {
                    const file_info = {
                        name: file.name,
                        fullPath: file.fullPath,
                        file_type: file.type,
                        duration: videoInfo.duration,
                        add_time: rTime(file.lastModifiedDate)
                    }
                    resolve(file_info)
                },
                fail: (error) => {
                    reject(err)
                }
            })
        }
    })
}

function rTime(date) {
    var json_date = new Date(date).toJSON()
    return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').split(
        ' ')[0]
}
