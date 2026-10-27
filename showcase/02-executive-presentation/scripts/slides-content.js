window.EXECUTIVE_SLIDES = [
  {
    kicker_vi: "SLIDE 1 • TỔNG QUAN NỀN TẢNG EXCELERATE-JINDER TRÊN GCP",
    kicker_en: "SLIDE 1 • EXCELERATE-JINDER ON GOOGLE CLOUD",
    title_vi: "Nâng Cấp Jinder Thành Nền Tảng Dữ Liệu & AI Thời Gian Thực",
    title_en: "Scaling Excelerate-Jinder Into a Real-Time Cloud Data & AI Platform",
    lead_vi: "Kết hợp ứng dụng khớp nối năng lực nghề nghiệp Excelerate-Jinder (6 công thức toán học F-01..F-06) với kiến trúc Data Lakehouse tự động hóa trên Google Cloud — chi phí nền tảng $0/tháng.",
    lead_en: "Unifying the Excelerate-Jinder capability alignment platform (canonical formulas F-01..F-06) with a serverless Google Cloud Data Lakehouse & Streaming architecture on a $0/month baseline.",
    cards_vi: [
      { icon: "🎯", title: "Chấm Điểm Khớp Nối Tức Thì", desc: "Mỗi lượt ứng viên xem, lưu hoặc nộp đơn trên Jinder được tính toán điểm khớp kỹ năng (SMF, GSI, FRS*) ngay trong tích tắc.", metric: "6 Công thức Toán học F-01..F-06" },
      { icon: "🙈", title: "Bảo Mật Zero-PII Tự Động (REQ-A07)", desc: "Nhà tuyển dụng chỉ thấy bí danh (Alias: Plum Wombat) và năng lực, còn Email/Tên thật được khóa chặt tự động ở cấp độ kho dữ liệu.", metric: "100% Công bằng & Không định kiến" },
      { icon: "💰", title: "Chạy Local Miễn Phí & Cloud $0/Tháng", desc: "Bất kỳ ai cũng chạy được Web App Jinder trên máy cá nhân, đồng thời hạ tầng phân tích trên GCP nằm gọn trong gói Free Tier.", metric: "An toàn tuyệt đối cho gói $300" }
    ],
    cards_en: [
      { icon: "🎯", title: "Real-Time Capability Scoring", desc: "Every candidate view, save, and application streams with live F-01 (SMF), F-02 (GSI), and F-05 (FRS*) alignment scores.", metric: "6 Canonical Formulas F-01..F-06" },
      { icon: "🙈", title: "Zero-PII By Design (REQ-A07)", desc: "Employers see only anonymized candidate aliases (e.g. Plum Wombat) and verified skill coverage while PII is masked in BigQuery.", metric: "Bias-Free Hiring Governance" },
      { icon: "💰", title: "Free Local App + $0/mo Cloud Core", desc: "Runs offline on any laptop (`make run-jinder-local`) while scaling to millions of events on GCP Free Tier.", metric: "100% Budget Safe" }
    ],
    notes_vi: "Xin chào mọi người. Hôm nay tôi xin trình bày cách chúng tôi đưa sản phẩm Hackathon Excelerate-Jinder — nền tảng khớp nối năng lực ứng viên và việc làm theo chuẩn nghề nghiệp Úc ANZSCO — lên kiến trúc đám mây Google Cloud Platform. Hệ thống vừa cho phép chạy ứng dụng trực tiếp trên máy cá nhân, vừa xử lý dữ liệu thời gian thực và bảo mật Zero-PII trên đám mây với chi phí duy trì nền tảng bằng 0.",
    notes_en: "Welcome everyone. Today I'm presenting how we scaled Excelerate-Jinder—our autonomous capability alignment platform—onto Google Cloud Platform, combining a zero-dependency local web app with a real-time cloud lakehouse, Zero-PII governance, and built-in AI."
  },
  {
    kicker_vi: "SLIDE 2 • BÀI TOÁN TUYỂN DỤNG & DỮ LIỆU CỦA JINDER",
    kicker_en: "SLIDE 2 • THE CHALLENGE JINDER SOLVES",
    title_vi: "3 Rào Cản Lớn Khi Mở Rộng Nền Tảng Tuyển Dụng Thông Minh",
    title_en: "Three Core Challenges in Modern Talent & Job Alignment",
    lead_vi: "Khi kết nối ứng viên quốc tế (Việt Nam, Úc...) với hàng ngàn tin tuyển dụng đa ngành, một cơ sở dữ liệu đơn lẻ không thể giải quyết trọn vẹn 3 bài toán sau:",
    lead_en: "When matching international and Australian candidates across thousands of job listings, traditional single-database apps hit three walls:",
    cards_vi: [
      { icon: "📊", title: "1. Dữ Liệu Lương & Kỹ Năng Không Đồng Nhất", desc: "Tin tuyển dụng ghi lương theo giờ ($74/h), theo ngày hoặc theo năm, cùng hàng trăm cách viết tên kỹ năng và mã nghề ANZSCO khác nhau.", metric: "Cần quy trình chuẩn hóa lớn" },
      { icon: "🔄", title: "2. Phản Hồi Hành Vi Phải Cập Nhật Tức Thời", desc: "Khi ứng viên bấm Lưu việc làm (+10% điểm) hoặc Bỏ qua 3 lần liên tiếp (-25% điểm), bảng gợi ý phải thay đổi ngay lập tức.", metric: "Cần đường ống Streaming" },
      { icon: "🛡️", title: "3. Rủi Ro Lộ Thông Tin Cá Nhân (PII)", desc: "Nếu nhà tuyển dụng hoặc bộ phận phân tích truy cập trực tiếp vào bảng hồ sơ gốc, tên thật và email của ứng viên sẽ bị lộ, gây thiên vị tuyển dụng.", metric: "Cần bảo mật cấp cột (Policy Tags)" }
    ],
    cards_en: [
      { icon: "📊", title: "1. Messy Salaries & Skill Taxonomies", desc: "Job postings mix hourly, daily, and annual pay rates alongside unstandardized skill descriptions across ANZSCO occupations.", metric: "Needs Automated Lakehouse Curation" },
      { icon: "🔄", title: "2. Instant Behavioral Feed Adjustment", desc: "Saving a job (+10% affinity) or skipping 3 roles from the same employer (-25% penalty) must update the candidate's feed immediately.", metric: "Needs Real-Time Streaming" },
      { icon: "🛡️", title: "3. Protecting Candidate Anonymity", desc: "Allowing direct database queries risks exposing candidate names, emails, and raw CVs to employers.", metric: "Needs Warehouse-Level PII Masking" }
    ],
    notes_vi: "Khi phát triển Jinder ở quy mô lớn, chúng ta gặp 3 bài toán: Một là chuẩn hóa mức lương giờ/ngày/năm và từ điển kỹ năng từ nhiều nguồn dữ liệu thật. Hai là cập nhật điểm gợi ý tức thì ngay khi ứng viên bấm Lưu hay Bỏ qua. Ba là đảm bảo nguyên tắc Zero-PII để nhà tuyển dụng đánh giá hoàn toàn dựa trên năng lực.",
    notes_en: "Scaling Jinder requires solving three data engineering problems: normalizing diverse salary formats and ANZSCO skills at scale, updating feed scores in real time as candidates save or skip jobs, and enforcing strict Zero-PII anonymity in the analytics warehouse."
  },
  {
    kicker_vi: "SLIDE 3 • HÀNH TRÌNH 4 BƯỚC CỦA DỮ LIỆU JINDER",
    kicker_en: "SLIDE 3 • END-TO-END JINDER DATA JOURNEY",
    title_vi: "Từ Cú Click Của Ứng Viên Đến Bảng Xếp Hạng AI Không Định Kiến",
    title_en: "From Candidate Interaction to Bias-Free AI Shortlisting",
    lead_vi: "Toàn bộ luồng dữ liệu của Excelerate-Jinder vận hành tự động qua 4 chặng rõ ràng trên Google Cloud:",
    lead_en: "Every interaction and dataset in Excelerate-Jinder flows through four automated stages on Google Cloud:",
    cards_vi: [
      { icon: "💻", title: "Chặng 1: Web App Jinder & Kho Dữ Liệu Thật", desc: "Thu thập sự kiện tương tác (Xem, Lưu, Bỏ qua, Ứng tuyển) và bộ dữ liệu việc làm/ứng viên Úc & Quốc tế (~3.5 MB gốc).", metric: "Pub/Sub & Cloud Storage" },
      { icon: "⚙️", title: "Chặng 2: Chuẩn Hóa Lương & Tính Điểm FRS*", desc: "Tự động quy đổi lương năm (giờ × 1950, ngày × 220), tính vòng lặp điểm hành vi FRS* và gạt riêng các tin tuyển dụng lỗi.", metric: "Dataflow & Dataproc Spark" },
      { icon: "🏛️", title: "Chặng 3: Mô Hình Star Schema & Khóa Zero-PII", desc: "Tổ chức thành bảng Ứng viên (`dim_customers`) chỉ hiện Alias công khai và bảng Việc làm (`dim_jobs`) phân nhóm theo mã ANZSCO.", metric: "BigQuery, BigLake & Policy Tags" },
      { icon: "🧠", title: "Chặng 4: AI Dự Đoán Xác Suất Vào Vòng Phỏng Vấn", desc: "Kết hợp 4 chỉ số toán học (SMF, GSI, FRS, TSS) để dự đoán khả năng ứng viên được chọn và dự báo nhu cầu tuyển dụng.", metric: "BigQuery ML" }
    ],
    cards_en: [
      { icon: "💻", title: "1. Jinder App & Real Corpus", desc: "Captures live candidate interactions (`JOB_VIEW`, `JOB_SAVE`, `JOB_APPLY`) alongside Australian & international job/resume datasets.", metric: "Pub/Sub & Cloud Storage" },
      { icon: "⚙️", title: "2. Salary Normalization & FRS* Loop", desc: "Converts hourly/daily pay to annual figures (`hr*1950`, `day*220`), updates behavioral `FRS*`, and quarantines bad records.", metric: "Dataflow & Dataproc Spark" },
      { icon: "🏛️", title: "3. Governed Star Schema Vault", desc: "Structures `dim_customers` (with Zero-PII Policy Tags) and `dim_jobs` (clustered by ANZSCO code) for sub-second analytics.", metric: "BigQuery, BigLake & Policy Tags" },
      { icon: "🧠", title: "4. AI Shortlist Prediction", desc: "Uses Jinder's F-01..F-06 mathematical scores inside BigQuery ML to predict shortlist success and 14-day application volume.", metric: "BigQuery ML" }
    ],
    notes_vi: "Đây là hành trình 4 bước của dữ liệu Jinder trên GCP: Từ lúc ứng viên tương tác trên Web App -> Qua bộ lọc chuẩn hóa lương và tính điểm hành vi FRS* -> Lưu vào mô hình Star Schema có gắn thẻ bảo mật Zero-PII -> Đến mô hình AI dự đoán xác suất trúng tuyển.",
    notes_en: "Here is the 4-step journey: candidate actions and real datasets enter through Pub/Sub and GCS, get normalized and scored by Dataflow and Spark, land in our Zero-PII Star Schema in BigQuery, and power BigQuery ML shortlist predictions."
  },
  {
    kicker_vi: "SLIDE 4 • VÒNG LẶP HÀNH VI & CHẤT LƯỢNG DỮ LIỆU",
    kicker_en: "SLIDE 4 • REAL-TIME BEHAVIORAL LOOP & QUALITY",
    title_vi: "Cách Jinder Cập Nhật Điểm Gợi Ý Tức Thì & Tự Cô Lập Dữ Liệu Lỗi",
    title_en: "Live Behavioral Ranking (FRS*) & Automatic Quarantine",
    lead_vi: "Đường ống Streaming giúp bảng Feed của ứng viên thông minh hơn sau mỗi cú click mà không bao giờ bị gián đoạn bởi dữ liệu hỏng:",
    lead_en: "Our streaming pipeline continuously adapts to candidate preferences while isolating corrupted job postings automatically:",
    cards_vi: [
      { icon: "❤️", title: "Thưởng Điểm Khi Ứng Viên Lưu Việc (+10%)", desc: "Khi ứng viên lưu 1 công việc, các việc làm cùng công ty tự động được cộng +10% điểm ưu tiên (hoặc +5% nếu cùng ngành nghề).", metric: "Tăng độ chính xác gợi ý" },
      { icon: "⏭️", title: "Giảm Điểm Khi Bỏ Qua Liên Tiếp (-25%)", desc: "Nếu ứng viên lướt bỏ qua từ 3 việc làm trở lên của cùng 1 nhà tuyển dụng, hệ thống tự động giảm 25% điểm của nhà tuyển dụng đó.", metric: "Công thức FRS*(J | C)" },
      { icon: "🗑️", title: "Khay Cách Ly Tin Tuyển Dụng Lỗi (DLQ)", desc: "Các bản ghi có mức lương âm hoặc tin tuyển dụng bị ứng viên báo cáo sai phạm >= 3 lần sẽ bị tách riêng vào bảng `malformed_events`.", metric: "Bảo vệ 100% độ sạch của Feed" }
    ],
    cards_en: [
      { icon: "❤️", title: "Save Affinity Boost (+10% / +5%)", desc: "Saving a job automatically boosts similar roles from the same employer (+10%) or ICT domain (+5%) in the candidate's stream.", metric: "Dynamic Personalization" },
      { icon: "⏭️", title: "Ignore Penalty (-25%)", desc: "Skipping 3 or more jobs from the same employer applies an automatic 25% ranking reduction via `compute_jinder_behavioral_frs`.", metric: "Formula FRS*(J | C)" },
      { icon: "🗑️", title: "Discrepancy & Error Quarantine (DLQ)", desc: "Postings with negative salary bugs or >= 3 candidate discrepancy reports are diverted into `raw.malformed_events`.", metric: "Self-Healing Feed Quality" }
    ],
    notes_vi: "Điểm khác biệt cốt lõi của Jinder là vòng lặp phản hồi hành vi: Hệ thống không chỉ tính điểm tĩnh, mà dùng luồng Streaming để cộng điểm khi ứng viên bấm Lưu, trừ điểm khi ứng viên bỏ qua liên tiếp, và tự động gạt các tin tuyển dụng sai phạm vào khay cách ly DLQ.",
    notes_en: "Jinder's streaming pipeline brings the behavioral feedback loop to life: boosting saved employers by 10%, penalizing repeatedly skipped employers by 25%, and quarantining corrupted records in a Dead-Letter table."
  },
  {
    kicker_vi: "SLIDE 5 • MÔ HÌNH HÓA DỮ LIỆU (STAR SCHEMA) & ZERO-PII",
    kicker_en: "SLIDE 5 • STAR SCHEMA MODELING & ZERO-PII GOVERNANCE",
    title_vi: "Thiết Kế Kho Dữ Liệu Chuẩn Tuyển Dụng Không Định Kiến (REQ-A07)",
    title_en: "Enforcing Bias-Free Hiring at the Data Warehouse Layer",
    lead_vi: "Trên BigQuery, toàn bộ dữ liệu của Jinder được tổ chức thành mô hình Star Schema tối ưu tốc độ và khóa chặt thông tin cá nhân:",
    lead_en: "In BigQuery, Jinder's data is modeled into a partitioned Star Schema with hardware-enforced column security:",
    cards_vi: [
      { icon: "👤", title: "Bảng Ứng Viên (`marts.dim_customers`)", desc: "Lưu trữ bí danh công khai (`alias`: Sage Swift, Plum Wombat), số năm kinh nghiệm và mã nghề mục tiêu. Cột Email/Tên thật được gắn nhãn khóa `PII_HIGH_SENSITIVITY`.", metric: "Chuẩn Zero-PII REQ-A07" },
      { icon: "💼", title: "Bảng Việc Làm (`marts.dim_jobs`)", desc: "Phân cụm theo Ngành nghề (`category`) và Mã nghề Úc (`anzsco_code`), với mức lương đã được quy đổi đồng nhất về lương năm.", metric: "Tra cứu dưới 1 giây" },
      { icon: "📊", title: "Bảng Sự Kiện & Phễu Ứng Tuyển (`fact_...`)", desc: "Chia ngăn tự động theo từng Ngày (`Partition by DAY`), lưu trọn vẹn 4 chỉ số toán học SMF, GSI, FRS, TSS tại thời điểm nộp đơn.", metric: "Tiết kiệm 90% phí truy vấn" }
    ],
    cards_en: [
      { icon: "👤", title: "Talent Dimension (`marts.dim_customers`)", desc: "Exposes public `alias` (e.g. Sage Swift), experience, and target ANZSCO code while locking `customer_email` behind Policy Tag `PII_HIGH_SENSITIVITY`.", metric: "REQ-A07 Zero-PII Compliant" },
      { icon: "💼", title: "Job Dimension (`marts.dim_jobs`)", desc: "Clustered by ICT `category` and 6-digit `anzsco_code` with standardized annual salary bands.", metric: "Sub-Second Filtering" },
      { icon: "📊", title: "Engagement & Funnel Facts", desc: "Partitioned daily with `require_partition_filter = true`, capturing snapshot scores (`SMF`, `GSI`, `FRS`, `TSS`) across the hiring funnel.", metric: "90% Query Cost Reduction" }
    ],
    notes_vi: "Khi chuyển sang BigQuery để làm Data Modeling, chúng ta xây dựng cấu trúc Star Schema gồm bảng Ứng viên, bảng Việc làm và bảng Sự kiện ứng tuyển. Đặc biệt, quy tắc Zero-PII (REQ-A07) của Jinder được bảo vệ trực tiếp bằng Policy Tag của Google Cloud: Nhà tuyển dụng chỉ nhìn thấy bí danh như 'Plum Wombat' cùng điểm kỹ năng, hoàn toàn không thấy Email hay tên thật.",
    notes_en: "Our Star Schema in BigQuery enforces Jinder's REQ-A07 Zero-PII rule natively: the `dim_customers` table exposes candidate aliases and skill metrics while Policy Tags automatically mask personal emails."
  },
  {
    kicker_vi: "SLIDE 6 • 6 CÔNG THỨC TOÁN HỌC KẾT HỢP BIGQUERY ML",
    kicker_en: "SLIDE 6 • MATHEMATICAL ENGINE MEETS BIGQUERY ML",
    title_vi: "Kết Hợp 6 Công Thức Cốt Lõi Của Jinder Với Trí Tuệ Nhân Tạo Đám Mây",
    title_en: "Combining Jinder's 6 Canonical Formulas with Warehouse-Native AI",
    lead_vi: "Các chỉ số toán học từ `jinder_backend_engine` trở thành đầu vào hoàn hảo (Feature Store) cho các mô hình AI trên BigQuery ML:",
    lead_en: "Scores computed by `jinder_backend_engine` feed directly into BigQuery ML models for predictive hiring analytics:",
    cards_vi: [
      { icon: "📐", title: "Đầu Vào Chuẩn Xác Từ F-01 Đến F-06", desc: "Điểm khớp kỹ năng (`SMF`), Chỉ số thiếu hụt chứng chỉ (`GSI`), Điểm xếp hạng Feed (`FRS`) và Điểm tìm kiếm ứng viên (`TSS`).", metric: "Không cần trích xuất lại đặc trưng" },
      { icon: "🎯", title: "Mô Hình Dự Đoán Vào Vòng Shortlist", desc: "Mô hình `ml.jinder_shortlist_logreg` tự động chuẩn hóa các điểm số để dự đoán xác suất hồ sơ ứng tuyển được nhà tuyển dụng chọn phỏng vấn.", metric: "Explainable AI (Giải thích được)" },
      { icon: "📈", title: "Dự Báo Nhu Cầu Tuyển Dụng 14 Ngày Tới", desc: "Mô hình chuỗi thời gian `ARIMA_PLUS` dự báo lượng đơn ứng tuyển và nhu cầu tuyển dụng theo từng nhóm ngành nghề.", metric: "Chủ động điều phối nguồn lực" }
    ],
    cards_en: [
      { icon: "📐", title: "Engineered Features (F-01..F-06)", desc: "Skill Match Frequency (`SMF`), Gap Severity Index (`GSI`), Feed Ranking Score (`FRS`), and Talent Search Score (`TSS`).", metric: "High-Signal ML Inputs" },
      { icon: "🎯", title: "Shortlist Probability Classifier", desc: "`ml.jinder_shortlist_logreg` uses `TRANSFORM()` scaling over Jinder's scores to predict which applications advance to interview.", metric: "Explainable AI Attributions" },
      { icon: "📈", title: "14-Day Hiring Demand Forecast", desc: "`ml.daily_revenue_forecast` (`ARIMA_PLUS`) forecasts upcoming application volume and market demand across sectors.", metric: "Automated Time-Series AI" }
    ],
    notes_vi: "Thay vì huấn luyện AI trên dữ liệu thô nhiễu loạn, chúng ta tận dụng chính 4 chỉ số toán học tinh hoa của Jinder (SMF, GSI, FRS, TSS) làm đầu vào cho BigQuery ML. Nhờ đó mô hình dự đoán trúng tuyển cực kỳ nhẹ, chính xác và giải thích rõ lý do vì sao ứng viên được chọn.",
    notes_en: "Because Jinder's mathematical engine already computes high-signal capability scores (SMF, GSI, FRS, TSS), BigQuery ML can train accurate, explainable shortlist prediction models in seconds using standard SQL."
  },
  {
    kicker_vi: "SLIDE 7 • CHẠY ĐỘC LẬP TRÊN LOCAL & AN TOÀN KHI MỞ PUBLIC REPO",
    kicker_en: "SLIDE 7 • PORTABLE LOCAL APP & PUBLIC REPO SECURITY",
    title_vi: "Bất Kỳ Ai Cũng Chạy Được App Local — Nhưng Tài Nguyên GCP Của Bạn Khóa Chặt 100%",
    title_en: "100% Runnable Locally by Anyone — 100% Locked GCP Billing Security",
    lead_vi: "Dự án được thiết kế để bạn tự tin để chế độ Public trên GitHub làm Portfolio mà không bao giờ lo lộ quyền truy cập đám mây:",
    lead_en: "Designed as a public showcase repository where external visitors can test the app locally without touching your cloud resources:",
    cards_vi: [
      { icon: "🖥️", title: "1 Lệnh Chạy Ngay Web App Jinder Ở Local", desc: "Người xem GitHub chỉ cần clone repo và gõ `make run-jinder-local` là trải nghiệm được toàn bộ giao diện Talent & Employer tại `localhost:8095`.", metric: "Không cần cài thư viện ngoài" },
      { icon: "🔒", title: "Tuyệt Đối Không Chứa Khóa Bí Mật (Zero Keys)", desc: "Trong code không có bất kỳ mật khẩu hay file JSON Key nào. Người ngoài không thể truy cập hay tiêu tốn dù chỉ $0.01 trong gói $300 của bạn.", metric: "An toàn 100% khi Public Repo" },
      { icon: "🛡️", title: "Khóa Cứng Theo Chủ Sở Hữu GitHub (WIF)", desc: "Cầu nối tự động với Google Cloud chỉ chấp nhận lệnh từ đúng tài khoản `ledinhduy281/gcp-pde-sdd-pipeline` của chính bạn.", metric: "Workload Identity Federation" }
    ],
    cards_en: [
      { icon: "🖥️", title: "One-Command Local Web App", desc: "Anyone cloning the repo runs `make run-jinder-local` to launch the full Jinder web app on `http://localhost:8095` using SQLite.", metric: "Zero External Dependencies" },
      { icon: "🔒", title: "Zero Static Keys in Git", desc: "No API keys, passwords, or GCP JSON credentials exist in the repo. External users cannot access your GCP project or $300 credit.", metric: "100% Safe Public Portfolio" },
      { icon: "🛡️", title: "Repository-Locked OIDC Federation", desc: "Workload Identity Federation explicitly verifies `assertion.repository == 'ledinhduy281/gcp-pde-sdd-pipeline'` before any cloud action.", metric: "Enterprise Keyless CI/CD" }
    ],
    notes_vi: "Một ưu điểm lớn của kiến trúc này: Khi chúng ta công khai repo lên GitHub, giám khảo hoặc nhà tuyển dụng có thể tải về và gõ `make run-jinder-local` để dùng thử ngay Web App Jinder trên máy của họ. Trong khi đó, tài khoản GCP $300 của chúng ta được bảo vệ tuyệt đối 100% nhờ cơ chế Keyless WIF.",
    notes_en: "When published on GitHub, anyone can clone the repository and run `make run-jinder-local` to test the live Jinder application on their own laptop, while your GCP project remains 100% protected via keyless Workload Identity Federation."
  },
  {
    kicker_vi: "SLIDE 8 • KIỂM SOÁT CHI PHÍ THÔNG MINH & KẾT LUẬN",
    kicker_en: "SLIDE 8 • SMART COST SWITCHBOARD & SUMMARY",
    title_vi: "Sở Hữu Kiến Trúc Dữ Liệu Doanh Nghiệp Lớn Với Chi Phí ~$0.00/Tháng",
    title_en: "Enterprise-Grade Data Engineering at a $0.00/Month Baseline",
    lead_vi: "Nhờ phương pháp Spec-Driven Development (SDD) và cơ chế Công tắc Terraform, toàn bộ nền tảng dữ liệu Jinder vận hành tối ưu tuyệt đối:",
    lead_en: "Powered by Spec-Driven Development (SDD) and Terraform Feature Flags, the platform delivers maximum capability with zero wasted spend:",
    cards_vi: [
      { icon: "🟢", title: "Tầng Nền Tảng Jinder Luôn Bật ($0/tháng)", desc: "Toàn bộ bộ dữ liệu thật (~3.5 MB), Pub/Sub, kho BigQuery Star Schema, khóa bảo mật Zero-PII và BigQuery ML đều nằm gọn trong Free Tier.", metric: "$0.00 Chi phí duy trì" },
      { icon: "🎛️", title: "Tầng Xử Lý Nặng Bật/Tắt Bằng 1 Lệnh", desc: "Chỉ khi cần thực hành sâu hoặc Demo tải cao (Bigtable, Dataflow, Cloud SQL, Composer) mới bật công tắc và tắt sạch ngay bằng `make lab-off`.", metric: "Bảo vệ trọn vẹn gói $300" },
      { icon: "🏆", title: "Sẵn Sàng Cho Cả Sản Phẩm Thực Tế & Kỳ Thi PDE", desc: "Bao phủ 100% các chủ đề trọng tâm của chứng chỉ Google Cloud Professional Data Engineer trên chính sản phẩm thực tế của bạn.", metric: "Từ Hackathon Đến Production" }
    ],
    cards_en: [
      { icon: "🟢", title: "Tier 1: Always-On Jinder Core ($0/mo)", desc: "Jinder's real datasets (~3.5 MB), Pub/Sub ingestion, BigQuery Star Schema, Zero-PII Policy Tags, and BQML run free within GCP Free Tier.", metric: "$0.00 Baseline Spend" },
      { icon: "🎛️", title: "Tier 2: One-Command Hourly Lab Switches", desc: "Heavy clusters (Bigtable, Dataflow, Cloud SQL, Composer) stay OFF by default and tear down cleanly via `make lab-off`.", metric: "Zero Surprise Bills" },
      { icon: "🏆", title: "From Hackathon Winner to Production & PDE", desc: "Covers 100% of Google Cloud Professional Data Engineer exam domains using your own real-world product and mathematical engine.", metric: "Production-Ready Architecture" }
    ],
    notes_vi: "Tổng kết lại: Với việc tích hợp Excelerate-Jinder vào hệ thống Spec-Driven GCP Pipeline này, chúng ta vừa có một sản phẩm Web App chạy thực tế, vừa có một kiến trúc Data Lakehouse & AI chuẩn Google Cloud với chi phí duy trì $0/tháng. Xin cảm ơn mọi người đã lắng nghe!",
    notes_en: "In summary, by unifying Excelerate-Jinder with our Spec-Driven GCP Terraform architecture, we have both a runnable local product and a production-grade cloud data platform running at a $0/month baseline. Thank you!"
  }
];
