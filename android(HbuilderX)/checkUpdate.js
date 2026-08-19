/**
 * 比较两个语义化版本号 (Semantic Versioning)
 * @param {string} v1 - 版本号1
 * @param {string} v2 - 版本号2
 * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
 */
function compareVersions(v1, v2) {
    const clean = (v) => String(v).replace(/^[vV]/, '').split('-')[0]; // 去除 'v' 前缀和预发布后缀
    const parts1 = clean(v1).split('.').map(Number);
    const parts2 = clean(v2).split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

/**
 * 检测 GitHub 项目是否为最新版本
 * @param {string} owner - 仓库所有者 (如 'Winnako155')
 * @param {string} repo - 仓库名称 (如 'Zundamon-Sprite-Editor')
 * @param {string} currentVersion - 当前本地版本号 (如 'v1.0.0')
 * @param {object} [options] - 可选配置
 * @param {string} [options.token] - GitHub Personal Access Token (用于提高 API 速率限制)
 * @returns {Promise<object>} 包含检测结果的对象
 */
async function checkGitHubVersion(owner, repo, currentVersion, options = {}) {
    const headers = new Headers({ 'Accept': 'application/vnd.github.v3+json' });
    if (options.token) {
        headers.append('Authorization', `token ${options.token}`);
    }

    try {
        // 优先尝试获取最新的 Release (这是最推荐的发布方式)
        let latestVersion = null;
        let releaseUrl = null;

        const releaseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers });
        
        if (releaseRes.ok) {
            const releaseData = await releaseRes.json();
            latestVersion = releaseData.tag_name;
            releaseUrl = releaseData.html_url;
        } else if (releaseRes.status === 404) {
            // 如果没有 Release，则退而求其次获取最新的 Tag
            const tagRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`, { headers });
            if (!tagRes.ok) throw new Error(`获取 Tags 失败: ${tagRes.status}`);
            
            const tags = await tagRes.json();
            if (tags.length > 0) {
                latestVersion = tags[0].name;
                releaseUrl = `https://github.com/${owner}/${repo}/tree/${latestVersion}`;
            }
        } else {
            throw new Error(`GitHub API 请求失败: ${releaseRes.status}`);
        }

        if (!latestVersion) {
            return { 
                isUpToDate: true, 
                currentVersion, 
                latestVersion: null, 
                message: '该项目尚未发布任何版本或标签' 
            };
        }

        const isUpToDate = compareVersions(currentVersion, latestVersion) >= 0;

        return {
            isUpToDate,
            currentVersion,
            latestVersion,
            releaseUrl,
            message: isUpToDate 
                ? '当前已是最新版本' 
                : `发现新版本: ${latestVersion}`
        };

    } catch (error) {
        console.error('版本检测出错:', error);
        return { 
            isUpToDate: null, 
            currentVersion, 
            latestVersion: null, 
            message: `检测失败: ${error.message}` 
        };
    }
}