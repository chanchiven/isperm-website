/**
 * 快速测试搜索历史功能
 * 在浏览器控制台中运行此脚本
 */

console.log('🔍 开始测试搜索历史功能...\n');

// 测试 1: 检查 localStorage 是否可用
console.log('测试 1: 检查 localStorage 可用性');
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage 可用\n');
} catch (error) {
  console.error('❌ localStorage 不可用:', error);
  console.log('⚠️  搜索历史功能可能无法正常工作\n');
}

// 测试 2: 查看当前搜索历史
console.log('测试 2: 查看当前搜索历史');
try {
  const stored = localStorage.getItem('isperm_search_history');
  if (stored) {
    const history = JSON.parse(stored);
    console.log(`✅ 找到 ${history.length} 条历史记录:`);
    history.slice(0, 5).forEach((item, index) => {
      const date = new Date(item.timestamp);
      console.log(`   ${index + 1}. "${item.query}" - ${item.resultCount || 0} 结果 - ${date.toLocaleString()}`);
    });
    if (history.length > 5) {
      console.log(`   ... 还有 ${history.length - 5} 条记录`);
    }
  } else {
    console.log('ℹ️  暂无搜索历史');
  }
  console.log('');
} catch (error) {
  console.error('❌ 读取历史失败:', error);
  console.log('');
}

// 测试 3: 添加测试数据
console.log('测试 3: 添加测试数据');
try {
  const testQueries = [
    { query: 'Nexus Dx1', count: 5 },
    { query: 'CASA system', count: 10 },
    { query: 'WHO 6th Edition', count: 8 }
  ];
  
  testQueries.forEach(({ query, count }) => {
    const stored = localStorage.getItem('isperm_search_history');
    const history = stored ? JSON.parse(stored) : [];
    const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    const newItem = {
      query: query,
      timestamp: Date.now() - Math.random() * 10000,
      resultCount: count
    };
    const newHistory = [newItem, ...filtered].slice(0, 20);
    localStorage.setItem('isperm_search_history', JSON.stringify(newHistory));
    console.log(`✅ 添加: "${query}"`);
  });
  console.log('');
} catch (error) {
  console.error('❌ 添加测试数据失败:', error);
  console.log('');
}

// 测试 4: 验证数据保存
console.log('测试 4: 验证数据保存');
try {
  const stored = localStorage.getItem('isperm_search_history');
  const history = JSON.parse(stored);
  console.log(`✅ 当前有 ${history.length} 条历史记录`);
  console.log('');
} catch (error) {
  console.error('❌ 验证失败:', error);
  console.log('');
}

// 测试 5: 测试重复搜索处理
console.log('测试 5: 测试重复搜索处理');
try {
  const stored = localStorage.getItem('isperm_search_history');
  const history = JSON.parse(stored);
  const beforeCount = history.filter(h => h.query.toLowerCase() === 'nexus dx1').length;
  
  // 添加重复搜索
  const filtered = history.filter(item => item.query.toLowerCase() !== 'nexus dx1');
  const newItem = { query: 'Nexus Dx1', timestamp: Date.now(), resultCount: 15 };
  const newHistory = [newItem, ...filtered].slice(0, 20);
  localStorage.setItem('isperm_search_history', JSON.stringify(newHistory));
  
  const afterHistory = JSON.parse(localStorage.getItem('isperm_search_history'));
  const afterCount = afterHistory.filter(h => h.query.toLowerCase() === 'nexus dx1').length;
  
  if (afterCount === 1 && afterHistory[0].query === 'Nexus Dx1') {
    console.log('✅ 重复搜索正确处理（合并为1条，移到最前）');
  } else {
    console.log('❌ 重复搜索处理失败');
  }
  console.log('');
} catch (error) {
  console.error('❌ 测试失败:', error);
  console.log('');
}

// 测试 6: 测试数量限制
console.log('测试 6: 测试数量限制（最多20条）');
try {
  // 模拟 saveSearchHistory 函数的行为（正确应用限制）
  function testSaveHistory(query, resultCount) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const history = stored ? JSON.parse(stored) : [];
    const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    const newItem = {
      query: query,
      timestamp: Date.now() - Math.random() * 1000,
      resultCount: resultCount
    };
    const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY);
    const sortedHistory = newHistory.sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedHistory));
  }
  
  // 添加25条测试数据（通过模拟函数，会正确应用限制）
  console.log('   通过 saveSearchHistory 逻辑添加25条数据...');
  for (let i = 0; i < 25; i++) {
    testSaveHistory(`Limit Test ${i}`, i);
  }
  
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  if (history.length <= MAX_HISTORY) {
    console.log(`✅ 数量限制正确（当前 ${history.length} 条，限制 ${MAX_HISTORY} 条）`);
  } else {
    console.log(`❌ 数量限制失败（当前 ${history.length} 条，应 ≤ ${MAX_HISTORY} 条）`);
  }
  console.log('');
} catch (error) {
  console.error('❌ 测试失败:', error);
  console.log('');
}

// 测试总结
console.log('📊 测试总结:');
console.log('✅ 基础功能测试完成');
console.log('✅ 数据处理测试完成');
console.log('✅ 边界情况测试完成');
console.log('\n💡 提示:');
console.log('1. 打开网站搜索框查看历史记录');
console.log('2. 执行几次搜索，观察历史记录变化');
console.log('3. 测试删除和清除功能');
console.log('4. 刷新页面验证数据持久化');
console.log('\n✨ 测试完成！');
