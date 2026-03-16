// 🧪 Test Markdown Formatter
// Script để test markdown formatting

function testMarkdownFormatter() {
    console.log('🧪 Testing markdown formatter...');
    
    const testText = `* **Kiểm tra trên portal sinh viên:** Đăng nhập vào tài khoản của bạn trên portal FPTU, thường thông tin học phí sẽ được cập nhật ở đó. 
* **Liên hệ Phòng Tài chính:**`;

    console.log('📝 Input text:', testText);
    
    const formattedHTML = window.formatMarkdownToHTML(testText);
    console.log('🎨 Formatted HTML:', formattedHTML);
    
    // Test trong một div để xem kết quả
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px; border-radius: 8px;">
            <h3>🧪 Markdown Formatter Test</h3>
            <p><strong>Input:</strong></p>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${testText}</pre>
            <p><strong>Output:</strong></p>
            <div style="background: #f0f9ff; padding: 10px; border-radius: 4px; border: 1px solid #0ea5e9;">${formattedHTML}</div>
        </div>
    `;
    
    document.body.appendChild(testDiv);
    
    console.log('✅ Test completed! Check the visual result at bottom of page.');
}

// Export để dùng trong console
window.testMarkdownFormatter = testMarkdownFormatter;

// Auto-run test
if (typeof window !== 'undefined') {
    setTimeout(() => {
        testMarkdownFormatter();
    }, 1000);
}
