window.EXECUTIVE_SLIDES = [
  {
    kicker_vi: "SLIDE 1 • TỔNG QUAN DỰ ÁN",
    kicker_en: "SLIDE 1 • EXECUTIVE SUMMARY",
    title_vi: "Biến Dữ Liệu Thô Thành Quyết Định Tức Thì",
    title_en: "Turning Raw Events Into Real-Time Business Decisions",
    lead_vi: "Xây dựng đường ống dữ liệu thông minh cho Thương mại Điện tử & Giao vận trên Google Cloud: Tự động hóa từ khâu thu thập, làm sạch, bảo mật đến dự báo bằng AI với chi phí vận hành nền tảng $0/tháng.",
    lead_en: "An end-to-end Google Cloud data platform for E-Commerce & Logistics: automating collection, quality control, privacy protection, and AI forecasting on a $0/month serverless baseline.",
    cards_vi: [
      { icon: "⚡", title: "Phản ứng tức thì", desc: "Nắm bắt từng lượt click và đơn hàng ngay trong giây lát thay vì phải chờ báo cáo cuối ngày.", metric: "Độ trễ < 5 giây" },
      { icon: "🛡️", title: "Không sợ dữ liệu rác", desc: "Cơ chế tự động tách riêng các giao dịch lỗi vào khay cách ly để hệ thống chạy liên tục 24/7.", metric: "99.9% Độ ổn định" },
      { icon: "💰", title: "Tối ưu ngân sách tuyệt đối", desc: "Ứng dụng kiến trúc 'Dùng bao nhiêu trả bấy nhiêu' — khi không có khách giao dịch, chi phí bằng 0.", metric: "Tiết kiệm > 85% ngân sách" }
    ],
    cards_en: [
      { icon: "⚡", title: "Real-Time Visibility", desc: "Capture customer clicks, orders, and delivery updates within seconds instead of waiting for next-day reports.", metric: "< 5s End-to-End Latency" },
      { icon: "🛡️", title: "Self-Healing Quality", desc: "Automatically isolates corrupted or invalid transactions so one bad record never stops business operations.", metric: "Zero Pipeline Downtime" },
      { icon: "💰", title: "Zero Idle Waste", desc: "Built on pay-per-use cloud services — when no orders are flowing, compute costs drop to $0.00.", metric: "> 85% Cost Reduction" }
    ],
    notes_vi: "Xin chào mọi người. Hôm nay tôi xin giới thiệu tổng quan về hệ thống đường ống dữ liệu (Data Pipeline) mà tôi đã xây dựng trên Google Cloud. Mục tiêu của hệ thống này không chỉ là lưu trữ dữ liệu, mà là giúp doanh nghiệp nhìn thấy đơn hàng ngay lập tức, tự động lọc sạch dữ liệu lỗi, và dự báo doanh thu bằng AI mà hầu như không tốn chi phí duy trì máy chủ nhàn rỗi.",
    notes_en: "Welcome everyone. Today I'm walking you through our modern data platform on Google Cloud. Instead of focusing on complex code, let's look at the three business outcomes it delivers: instant visibility into live orders, automatic protection against bad data, and smart cost control that eliminates idle server bills."
  },
  {
    kicker_vi: "SLIDE 2 • BÀI TOÁN THỰC TẾ",
    kicker_en: "SLIDE 2 • THE BUSINESS CHALLENGE",
    title_vi: "Tại Sao Các Hệ Thống Dữ Liệu Truyền Thống Thường Thất Bại?",
    title_en: "Why Traditional Data Systems Struggle to Scale",
    lead_vi: "Khi lượng đơn hàng tăng đột biến, doanh nghiệp thường đối mặt với 3 nút thắt lớn về tốc độ, độ tin cậy và chi phí.",
    lead_en: "As transaction volumes grow, organizations typically hit three painful bottlenecks in speed, reliability, and cloud bills.",
    cards_vi: [
      { icon: "🐢", title: "1. Báo cáo chậm trễ", desc: "Dữ liệu nằm rời rạc ở web bán hàng, ứng dụng giao nhận và file kế toán. Lãnh đạo luôn nhìn vào số liệu của ngày hôm qua.", metric: "Mất cơ hội phản ứng nhanh" },
      { icon: "💥", title: "2. Một hạt sạn làm hỏng cả nồi canh", desc: "Chỉ cần 1 đơn hàng bị lỗi định dạng từ đối tác gửi sang cũng có thể làm treo toàn bộ tiến trình tổng hợp báo cáo.", metric: "Tốn hàng giờ sửa lỗi thủ công" },
      { icon: "💸", title: "3. Nuôi máy chủ 24/24 tốn kém", desc: "Thuê cụm máy chủ lớn chạy suốt đêm ngày dù chỉ thực sự bận rộn vào vài khung giờ cao điểm.", metric: "Lãng phí ngân sách Cloud" }
    ],
    cards_en: [
      { icon: "🐢", title: "1. Blind Spots & Delays", desc: "Customer behavior, checkout records, and delivery statuses sit in separate silos, delaying executive insights by 24+ hours.", metric: "Slow Decision Making" },
      { icon: "💥", title: "2. Fragile Data Flows", desc: "A single malformed record from a mobile app update can crash traditional nightly batch jobs.", metric: "High Maintenance Overhead" },
      { icon: "💸", title: "3. Paying for Idle Servers", desc: "Running fixed server clusters 24/7 even when traffic is low drains budgets rapidly.", metric: "Unpredictable Cloud Bills" }
    ],
    notes_vi: "Trước khi đi vào giải pháp, hãy nhìn vào 3 vấn đề thực tế: Thứ nhất là dữ liệu bị trễ. Thứ hai là hệ thống truyền thống rất mong manh — chỉ 1 dòng dữ liệu sai cũng làm dừng cả dây chuyền. Và thứ ba là chi phí nuôi máy chủ 24/7 cực kỳ lãng phí.",
    notes_en: "Traditional pipelines suffer from three common issues: delayed reporting across disconnected silos, fragile batch jobs that break when unexpected data arrives, and expensive 24/7 server clusters that sit idle most of the day."
  },
  {
    kicker_vi: "SLIDE 3 • HÀNH TRÌNH CỦA DỮ LIỆU",
    kicker_en: "SLIDE 3 • END-TO-END JOURNEY",
    title_vi: "Hành Trình 4 Bước Từ Lúc Khách Bấm Nút Đến Bảng Điều Khiển",
    title_en: "How Data Flows: From Customer Click to Executive Dashboard",
    lead_vi: "Hãy hình dung hệ thống giống như một nhà máy chế biến hiện đại, hoàn toàn tự động qua 4 chặng rõ ràng.",
    lead_en: "Think of the pipeline as a modern, automated fulfillment center organized into four intuitive stages.",
    cards_vi: [
      { icon: "📬", title: "Chặng 1: Sảnh Tiếp Nhận", desc: "Mọi thao tác mua hàng và định vị giao vận được gom về cổng tiếp nhận tốc độ cao, không bao giờ bị kẹt mạng.", metric: "Cloud Pub/Sub & Storage" },
      { icon: "🧼", title: "Chặng 2: Dây Chuyền Tinh Lọc", desc: "Kiểm tra từng giao dịch, loại bỏ bản trùng lặp và tự động gạt dữ liệu lỗi sang khay riêng để xử lý sau.", metric: "Dataflow & Spark" },
      { icon: "🏛️", title: "Chặng 3: Trung Tâm Lưu Trữ Thông Minh", desc: "Sắp xếp dữ liệu ngăn nắp theo từng ngày và từng nhóm khách hàng, giúp tra cứu hàng triệu dòng trong 1 giây.", metric: "BigQuery & BigLake" },
      { icon: "🤖", title: "Chặng 4: Trí Tuệ Nhân Tạo Dự Báo", desc: "Phân tích xu hướng mua sắm để dự báo doanh thu 14 ngày tới và phát hiện sớm khách hàng có nguy cơ rời bỏ.", metric: "BigQuery ML" }
    ],
    cards_en: [
      { icon: "📬", title: "1. Smart Front Door", desc: "Captures live clicks, orders, and batch files simultaneously without dropping a single event during peak sales.", metric: "Cloud Pub/Sub & Storage" },
      { icon: "🧼", title: "2. Automated Quality Filter", desc: "Cleans, deduplicates, and validates every transaction while diverting bad records into a quarantine bin.", metric: "Dataflow & Spark" },
      { icon: "🏛️", title: "3. Organized Business Vault", desc: "Structures clean data by date and customer segment so complex business questions run in under a second.", metric: "BigQuery & BigLake" },
      { icon: "🤖", title: "4. Built-in AI Forecasting", desc: "Predicts 14-day revenue trends and identifies at-risk customers automatically.", metric: "BigQuery ML" }
    ],
    notes_vi: "Trên màn hình là toàn bộ bức tranh tổng thể gồm 4 chặng: Sảnh tiếp nhận không bao giờ nghẽn -> Dây chuyền lọc sạch tự động -> Kho lưu trữ thông minh -> Và cuối cùng là AI dự báo tương lai.",
    notes_en: "Here is the entire platform in four simple steps: a shock-absorbing front door, an automated quality filter, an organized analytics vault, and built-in AI forecasting."
  },
  {
    kicker_vi: "SLIDE 4 • HAI LÀN ĐƯỜNG TỐC ĐỘ",
    kicker_en: "SLIDE 4 • DUAL-SPEED ARCHITECTURE",
    title_vi: "Kết Hợp Hoàn Hảo: 'Làn Phản Ứng Nhanh' & 'Làn Tổng Hợp Sâu'",
    title_en: "Combining Real-Time Speed with Deep Historical Accuracy",
    lead_vi: "Không phải dữ liệu nào cũng cần xử lý giống nhau. Hệ thống chia làm 2 làn đường chuyên biệt để vừa nhanh vừa rẻ.",
    lead_en: "Not all data needs the same treatment. Our architecture balances instant responsiveness with cost-effective bulk processing.",
    cards_vi: [
      { icon: "🏎️", title: "Làn Nóng (Real-Time Streaming)", desc: "Xử lý ngay lập tức các sự kiện đang diễn ra (đơn hàng mới, vị trí tài xế, cảnh báo gian lận) để hiển thị tức thời trên ứng dụng.", metric: "Phản hồi trong vài giây" },
      { icon: "🚛", title: "Làn Lạnh (Batch Lakehouse)", desc: "Tổng hợp hàng triệu hóa đơn lịch sử vào ban đêm, nén gọn dung lượng tới 80% để phục vụ báo cáo chiến lược dài hạn.", metric: "Chi phí lưu trữ cực thấp" },
      { icon: "🔗", title: "Hợp Nhất Tại Một Nơi Duy Nhất", desc: "Người dùng cuối và lãnh đạo chỉ cần mở một màn hình báo cáo duy nhất mà không cần bận tâm dữ liệu đến từ làn nào.", metric: "Trải nghiệm đồng nhất" }
    ],
    cards_en: [
      { icon: "🏎️", title: "The Fast Lane (Real-Time Stream)", desc: "Processes live orders and GPS updates the moment they happen to power live operational dashboards.", metric: "Seconds Latency" },
      { icon: "🚛", title: "The Bulk Lane (Lakehouse Batch)", desc: "Compresses and deduplicates millions of historical records into high-efficiency storage at a fraction of the cost.", metric: "80% Storage Savings" },
      { icon: "🔗", title: "One Unified View", desc: "Decision-makers query both live and historical insights from a single unified hub.", metric: "Single Source of Truth" }
    ],
    notes_vi: "Điểm hay của thiết kế này là chia làm 2 làn: Làn Nóng giống như xe cấp cứu ưu tiên chạy ngay cho các thông tin tức thời; Làn Lạnh giống như tàu chở hàng lớn chạy định kỳ với chi phí siêu rẻ. Cả hai cuối cùng đều hội tụ về một kho trung tâm.",
    notes_en: "We split workloads into two lanes: a Fast Lane for immediate operational events, and a Bulk Lane for heavy historical data compression. Both converge into one unified view for business users."
  },
  {
    kicker_vi: "SLIDE 5 • KIỂM SOÁT CHẤT LƯỢNG TỰ ĐỘNG",
    kicker_en: "SLIDE 5 • AUTOMATIC DATA QUALITY",
    title_vi: "Cơ Chế 'Khay Hứng Hàng Lỗi' Giúp Hệ Thống Không Bao Giờ Đứng Máy",
    title_en: "How the 'Quarantine Bin' Keeps Operations Running 24/7",
    lead_vi: "Trong thực tế, dữ liệu gửi về luôn có tỉ lệ lỗi (thiếu thông tin, sai số tiền, mạng trễ). Đây là cách hệ thống tự bảo vệ mình:",
    lead_en: "Real-world data is messy. Here is how our pipeline handles corrupted or delayed records automatically without human intervention:",
    cards_vi: [
      { icon: "✅", title: "95% Giao Dịch Hợp Lệ -> Đi Thẳng", desc: "Các đơn hàng đầy đủ thông tin, số tiền hợp lệ được đóng dấu xác nhận và đưa thẳng vào bảng doanh thu chính thức.", metric: "Luồng chính thông suốt" },
      { icon: "🚨", title: "5% Giao Dịch Lỗi -> Vào Khay Cách Ly", desc: "Nếu phát hiện đơn hàng có số tiền âm (-$99) hoặc lỗi định dạng, hệ thống tự động tách riêng sang bảng 'Hàng Lỗi' kèm nguyên nhân chi tiết.", metric: "Không làm gián đoạn báo cáo" },
      { icon: "⏱️", title: "Đơn Hàng Đến Trễ -> Tự Động Ghép Đúng Giờ", desc: "Nếu điện thoại khách mất sóng 2 phút mới gửi được đơn, hệ thống vẫn thông minh xếp đơn đó về đúng khung giờ khách đã bấm mua.", metric: "Báo cáo chính xác 100%" }
    ],
    cards_en: [
      { icon: "✅", title: "Clean Records Flow Through", desc: "Transactions that pass all business rules move immediately into executive reporting tables.", metric: "Zero Bottlenecks" },
      { icon: "🚨", title: "Bad Records Are Quarantined", desc: "Invalid records (like negative order amounts) are automatically diverted to an inspection table with the exact failure reason.", metric: "100% Auditability" },
      { icon: "⏱️", title: "Late Mobile Data Is Corrected", desc: "If a user's phone loses signal and sends an order 2 minutes late, the system places it in the true purchase time window.", metric: "Accurate Time Accounting" }
    ],
    notes_vi: "Một điểm nhấn rất quan trọng khi vận hành thực tế: Khi có dữ liệu lỗi (ví dụ giá tiền âm do lỗi phần mềm) hoặc dữ liệu đến muộn do mạng yếu, hệ thống không bị sập mà tự động tách riêng hàng lỗi sang khay cách ly để kiểm tra, còn hàng tốt vẫn chạy bình thường.",
    notes_en: "When bad data arrives—such as a negative price bug—our pipeline doesn't crash. It diverts the bad record into a quarantine table with an explanation while clean orders keep flowing."
  },
  {
    kicker_vi: "SLIDE 6 • BẢO MẬT & QUYỀN RIÊNG TƯ",
    kicker_en: "SLIDE 6 • SECURITY & PRIVACY BY DESIGN",
    title_vi: "Bảo Vệ Thông Tin Khách Hàng Như Hệ Thống Ngân Hàng",
    title_en: "Enterprise-Grade Privacy & Keyless Security",
    lead_vi: "Doanh nghiệp khai thác tối đa giá trị từ dữ liệu nhưng vẫn bảo vệ tuyệt đối thông tin nhạy cảm (Email, Số điện thoại) của khách hàng.",
    lead_en: "Analysts get the insights they need while sensitive customer information (PII) remains strictly protected.",
    cards_vi: [
      { icon: "🙈", title: "Kính Mờ Tự Động Che Dữ Liệu Nhạy Cảm", desc: "Cùng nhìn vào 1 bảng khách hàng, nhân viên phân tích chỉ thấy doanh số, còn cột Email/SĐT tự động được ẩn đi trừ khi có quyền đặc biệt.", metric: "Bảo mật đến từng cột" },
      { icon: "🔑", title: "Không Dùng Mật Khẩu Tĩnh", desc: "Loại bỏ hoàn toàn rủi ro lộ file mật khẩu trên máy tính cá nhân nhờ cơ chế xác thực tự động giữa GitHub và Google Cloud.", metric: "An toàn tuyệt đối (Keyless)" },
      { icon: "🔒", title: "Mã Hóa & Tự Động Đổi Khóa 90 Ngày", desc: "Toàn bộ dữ liệu lưu trong kho đều được khóa bằng chìa khóa riêng của dự án và tự động thay ổ khóa mới mỗi 90 ngày.", metric: "Chuẩn tuân thủ quốc tế" }
    ],
    cards_en: [
      { icon: "🙈", title: "Automatic PII Masking", desc: "Analysts can query customer trends freely while sensitive columns like Email and Phone are hidden unless explicitly authorized.", metric: "Column-Level Governance" },
      { icon: "🔑", title: "Zero Leaked Passwords", desc: "Eliminates static password files entirely using short-lived, keyless identity federation between GitHub and Google Cloud.", metric: "Keyless Security" },
      { icon: "🔒", title: "90-Day Auto-Rotating Encryption", desc: "All stored data is protected by customer-managed encryption keys that rotate automatically every 90 days.", metric: "Full Compliance" }
    ],
    notes_vi: "Về mặt bảo mật: Hệ thống áp dụng nguyên tắc phân quyền tới từng cột dữ liệu. Nhân viên phân tích vẫn tính được tổng doanh thu theo khu vực nhưng không xem được Email cá nhân của khách hàng. Đồng thời hệ thống không dùng bất kỳ file mật khẩu tĩnh nào có nguy cơ bị rò rỉ.",
    notes_en: "Security is baked into the foundation: sensitive customer emails are protected at the column level, encryption keys rotate every 90 days, and static credentials are completely eliminated."
  },
  {
    kicker_vi: "SLIDE 7 • TRÍ TUỆ NHÂN TẠO (AI) TÍCH HỢP SẴN",
    kicker_en: "SLIDE 7 • BUILT-IN AI & FORECASTING",
    title_vi: "Từ 'Nhìn Lại Quá Khứ' Sang 'Dự Đoán Tương Lai'",
    title_en: "Moving From 'What Happened Yesterday' to 'What Will Happen Next Week'",
    lead_vi: "Trí tuệ nhân tạo (Machine Learning) được nhúng trực tiếp ngay bên trong kho dữ liệu để trả lời 2 câu hỏi sống còn của kinh doanh:",
    lead_en: "Machine Learning runs directly inside the data warehouse to answer two high-value business questions automatically:",
    cards_vi: [
      { icon: "📈", title: "1. Dự Báo Doanh Thu 14 Ngày Tới", desc: "Tự động học quy luật mùa vụ, ngày cuối tuần và ngày lễ để dự báo doanh thu sắp tới, giúp chuẩn bị hàng tồn kho và nhân sự giao hàng.", metric: "Mô hình Chuỗi thời gian" },
      { icon: "🧲", title: "2. Phát Hiện Sớm Khách Hàng Sắp Rời Bỏ", desc: "Chấm điểm xác suất từng khách hàng có nguy cơ ngừng mua sắm dựa trên tần suất ghé thăm và giá trị giỏ hàng 30 ngày qua.", metric: "Chủ động giữ chân khách" },
      { icon: "💡", title: "Giải Thích Được Lý Do Dự Đoán", desc: "Không chỉ đưa ra con số, AI còn chỉ rõ yếu tố nào khiến khách hàng sắp rời bỏ để đội ngũ Marketing tung khuyến mãi đúng trọng tâm.", metric: "AI Minh Bạch (Explainable AI)" }
    ],
    cards_en: [
      { icon: "📈", title: "1. 14-Day Demand Forecasting", desc: "Automatically learns weekly seasonality and holiday effects to predict upcoming order volume and staffing needs.", metric: "Automated Time-Series AI" },
      { icon: "🧲", title: "2. Customer Churn Prediction", desc: "Scores each customer's likelihood of churning based on 30-day browsing and purchase behavior.", metric: "Proactive Retention" },
      { icon: "💡", title: "3. Explainable AI Insights", desc: "Highlights the exact factors driving each prediction so marketing teams know how to intervene.", metric: "Actionable Intelligence" }
    ],
    notes_vi: "Khi dữ liệu đã sạch và chuẩn, chúng ta không chỉ dừng lại ở việc vẽ biểu đồ quá khứ. Hệ thống tích hợp sẵn AI để dự báo doanh thu 2 tuần tới và chỉ ra danh sách khách hàng có nguy cơ rời bỏ để đội kinh doanh chăm sóc kịp thời.",
    notes_en: "Once data is clean and centralized, built-in AI models forecast revenue 14 days ahead and flag customers at risk of churning—complete with explainable factors for the marketing team."
  },
  {
    kicker_vi: "SLIDE 8 • KIỂM SOÁT CHI PHÍ & QUẢN TRỊ BẰNG CODE",
    kicker_en: "SLIDE 8 • SMART COST CONTROL & AUTOMATION",
    title_vi: "Kiến Trúc 'Công Tắc Thông Minh' — Bảo Vệ Ngân Sách Tuyệt Đối",
    title_en: "The 'Smart Switchboard' Architecture: 100% Budget Control",
    lead_vi: "Toàn bộ hệ thống được định nghĩa bằng mã lệnh tự động (Infrastructure-as-Code) và chia làm 2 tầng chi phí rõ rệt:",
    lead_en: "The entire platform is automated via code and structured into a Two-Tier Cost Model that prevents surprise cloud bills:",
    cards_vi: [
      { icon: "🟢", title: "Tầng Nền Tảng (Luôn Bật — $0/tháng)", desc: "Kho lưu trữ, cổng tiếp nhận, trung tâm phân tích BigQuery, bảo mật và bộ điều phối tự động hoàn toàn nằm trong hạn mức miễn phí.", metric: "$0.00 Chi phí duy trì" },
      { icon: "🎛️", title: "Tầng Xử Lý Cao Cấp (Bật/Tắt Bằng 1 Lệnh)", desc: "Các cụm máy tính phí theo giờ chỉ được bật lên đúng lúc cần chạy thử nghiệm tải cao và tắt sạch ngay lập tức bằng 1 công tắc.", metric: "Kiểm soát 100% ngân sách" },
      { icon: "🚀", title: "Sẵn Sàng Nhân Bản Trong 5 Phút", desc: "Nhờ quản lý hoàn toàn trên GitHub, toàn bộ hệ thống có thể được dựng mới hoặc khôi phục sang bất kỳ môi trường nào chỉ trong vài phút.", metric: "Tự động hóa 100%" }
    ],
    cards_en: [
      { icon: "🟢", title: "Tier 1: Always-On Foundation ($0/mo)", desc: "Storage, messaging, BigQuery analytics, security governance, and daily workflows run continuously within the Free Tier.", metric: "$0.00 Baseline Cost" },
      { icon: "🎛️", title: "Tier 2: On-Demand High-Power Switches", desc: "Hourly compute clusters are toggled ON only when needed and shut down completely with a single command (`make lab-off`).", metric: "Zero Surprise Billing" },
      { icon: "🚀", title: "Reproducible in 5 Minutes", desc: "Because every component is defined in GitHub code, the entire platform can be deployed or rebuilt from scratch in minutes.", metric: "100% Automated" }
    ],
    notes_vi: "Kết lại buổi trình bày: Điểm sáng tạo nhất của dự án này là cơ chế 'Công tắc thông minh'. Toàn bộ khung xương sống của hệ thống chạy 24/7 với chi phí $0. Các bộ phận tính phí theo giờ được điều khiển qua công tắc tự động, giúp chúng ta sở hữu một kiến trúc chuẩn doanh nghiệp lớn mà chỉ tốn vài chục USD ngân sách thử nghiệm. Xin cảm ơn!",
    notes_en: "To wrap up: the defining feature of this platform is its Smart Switchboard architecture. Our core analytics foundation runs 24/7 at $0 cost, while heavy hourly clusters can be toggled on and off on demand with a single command. Thank you—I'd love to open the floor for questions!"
  }
];
