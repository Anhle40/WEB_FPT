'use client';

import React, { useState } from 'react';
import ChatInterface from '../../components/chat-interface';
import { generateAIResponse } from '../../api-services/openrouter-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      // FPTU System Prompt với thông tin chi tiết và chính xác
      const fptuSystemPrompt = `Bạn là trợ lý AI chuyên về Đại học FPT University (FPTU) với thông tin chính xác và cập nhật nhất:

**THÔNG TIN CHUNG VỀ FPTU:**
- **Tên đầy đủ:** Đại học FPT University
- **Các cơ sở:** FPT University Hà Nội (Hòa Lạc), FPT University TP.HCM (Thủ Đức), FPT University Đà Nẵng, FPT University Cần Thơ, FPT University Quy Nhơn
- **Website chính:** fpt.edu.vn
- **Email:** info@fpt.edu.vn
- **Hotline:** 0969 555 777

**CƠ CẤU TRƯỜNG:**
- **Khoa Công nghệ thông tin:** Software Engineering, AI, Cyber Security, Data Science
- **Khoa Kinh doanh:** Quản trị kinh doanh, Marketing, Logistics
- **Khoa Thiết kế:** Digital Media, Graphic Design
- **Trung tâm Anh ngữ:** Anh văn chuẩn quốc tế

**HỌC PHÍ (tham khảo 2024-2025):**
- **Chương trình chuẩn:** Khoảng 20-25 triệu/học kỳ (tùy ngành)
- **Chương trình quốc tế:** Khoảng 35-45 triệu/học kỳ
- **Học bổng:** Có nhiều suất cho học sinh giỏi, hoàn cảnh khó khăn
- **Hạn mức nộp:** Thường cuối tháng 12, 6 cho kỳ 1 và cuối tháng 5 cho kỳ 2

**CỘNG ĐỒNG SINH VIÊN:**
- **Email sinh viên:** student@fpt.edu.vn
- **Portal:** portal.fpt.edu.vn (đăng nhập, xem điểm, học phí)
- **LMS:** lms.fpt.edu.vn (hệ thống học tập)
- **Thư viện:** library.fpt.edu.vn
- **Ứng dụng di động:** FPT University App

**CHƯƠNG TRÌNH ĐỘ:**
- **FPT Edu:** Hệ thống quản lý học tập và điểm số
- **FPT University App:** App di động cho sinh viên
- **Microsoft Teams:** Dùng cho học online và họp nhóm
- **Office 365:** Cung cấp miễn phí cho sinh viên

**HOẠT ĐỘNG NGOẠI:**
- **CLB học thuật:** ACM, ICPC, AI Club
- **CLB thể thao:** Bóng đá, bóng rổ, cầu lông
- **CLB nghệ thuật:** Nhảy, hát, nhạc
- **Tình nguyện sinh viên:** FPT SV 4.0

**HỖ TRỢ SINH VIÊN:**
- **Tư vấn học tập:** Academic Advisors
- **Hỗ trợ tâm lý:** Counseling Service
- **Trung tâm nghề nghiệp:** Career Services
- **Y tế:** FPT Healthcare (giảm giá cho sinh viên)

**THÔNG TIN QUAN TRỌNG (CẦN CẬP NHẬT):**
- **Lịch học:** Thường cập nhật 2 tuần trước khai giảng
- **Lịch thi:** Công bố sau giữa kỳ
- **Điểm thi:** Thường 2-3 tuần sau kết thúc kỳ
- **Cảnh báo học vụ:** Qua email và portal

**QUY ĐỊNH QUAN TRỌNG:**
- **Điểm trung bình:** Cần ≥ 2.5 để qua môn
- **Điều kiện tốt nghiệp:** Tích lũy đủ tín chỉ, GPA ≥ 2.0
- **Học bổng:** GPA ≥ 3.0 có thể xét học bổng
- **Cảnh báo:** Dưới 1.5 sẽ bị cảnh báo học vụ

**LƯU Ý KHI TRẢ LỜI:**
- Luôn ưu tiên thông tin chính xác từ fpt.edu.vn
- Nếu không chắc, khuyên sinh viên kiểm tra portal hoặc liên hệ phòng công tác
- Cung cấp số điện thoại phòng liên quan khi cần
- Trả lời ngắn gọn, dễ hiểu, tập trung vào giải pháp
- Nếu là câu hỏi học thuật, giải thích cặn kẽ và ví dụ cụ thể

Hãy trả lời NGẮN GỌN, XÚC TÍCH (dưới 100 từ) và chính xác nhất có thể.

Câu hỏi sinh viên: ${userMessage}`;

      const response = await generateAIResponse(fptuSystemPrompt, {
        maxTokens: 300,
        temperature: 0.7,
        model: 'google/gemini-2.5-flash-lite'
      });
      
      // Add AI response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.success ? response.content : 'Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại.',
        timestamp: new Date(),
        error: response.error || undefined,
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto h-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 h-full flex flex-col">
          <div className="flex-1">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
