// Parts, colour variants and copy (EN / VI). Japanese names are shared decoration.
// Spec values are approximate, for reference only.

export const VARIANTS = [
  { id: 'white', name: { en: 'Pearl White',    vi: 'Trắng Ngọc'  }, tint: '#ffffff', p: '#f1f2f5', p2: '#9aa0ab', accent: '#ff3b30' },
  { id: 'black', name: { en: 'Metallic Black', vi: 'Đen Ánh Kim' }, tint: '#2a2c31', p: '#1b1c20', p2: '#caa24a', accent: '#ffb020' },
  { id: 'red',   name: { en: 'Candy Red',      vi: 'Đỏ Candy'    }, tint: '#d3142c', p: '#c4122c', p2: '#16181d', accent: '#ff3350' },
  { id: 'blue',  name: { en: 'Racing Blue',    vi: 'Xanh Đua'    }, tint: '#1f56e0', p: '#1f56e0', p2: '#e9ecf2', accent: '#3d8bff' },
];

export const GROUPS = [
  { id: 'body',    ja: '外装',   en: 'Bodywork',   vi: 'Vỏ xe' },
  { id: 'cockpit', ja: '操縦部', en: 'Cockpit',    vi: 'Buồng lái' },
  { id: 'power',   ja: '動力',   en: 'Powertrain', vi: 'Động lực' },
  { id: 'chassis', ja: '足回り', en: 'Chassis',    vi: 'Khung gầm' },
];

// view: az (deg, 0 = from right side, 90 = from front, 180 = left), el (deg), d = distance factor
// explode: [forward, up, right]; `lateral` pushes left/right halves apart
export const PARTS = [
  {
    id: 'front-fairing', group: 'body', ja: 'フロントカウル', view: { az: 52, el: 10, d: 1.0 }, explode: [0.65, 0.12, 0],
    en: { name: 'Front Fairing', desc: 'The wind-cheating nose that made the Hayabusa famous. Its sculpted air intakes feed the airbox while the shape keeps the bike stable at extreme speed.',
      specs: [['Purpose', 'Aerodynamics & ram-air intake'], ['Material', 'Painted ABS'], ['Design', 'Wind-tunnel developed']] },
    vi: { name: 'Ốp mũi trước', desc: 'Phần mũi xe cắt gió làm nên tên tuổi Hayabusa. Các cửa hút gió dẫn khí vào hộp lọc, hình khối giúp xe ổn định ở tốc độ cực cao.',
      specs: [['Chức năng', 'Khí động học & hút gió'], ['Chất liệu', 'Nhựa ABS sơn'], ['Thiết kế', 'Thử nghiệm hầm gió']] },
  },
  {
    id: 'windscreen', group: 'body', ja: 'ウインドスクリーン', view: { az: 40, el: 18, d: 1.0 }, explode: [0.35, 0.6, 0],
    en: { name: 'Windscreen', desc: 'A tall, tinted screen lifts the airflow over the rider, cutting wind blast and fatigue on long, fast rides.',
      specs: [['Type', 'Tinted polycarbonate'], ['Function', 'Wind deflection'], ['Fit', 'Bolted to fairing stay']] },
    vi: { name: 'Kính chắn gió', desc: 'Kính cao có phủ màu đẩy luồng gió qua đầu người lái, giảm áp lực gió và mệt mỏi khi chạy đường dài tốc độ cao.',
      specs: [['Loại', 'Polycarbonate phủ màu'], ['Chức năng', 'Dẫn hướng gió'], ['Lắp', 'Bắt vào khung ốp']] },
  },
  {
    id: 'headlight', group: 'cockpit', ja: 'ヘッドライト', view: { az: 70, el: 8, d: 1.0 }, explode: [0.8, 0.02, 0],
    en: { name: 'Headlight', desc: 'Twin projector-style lamps sit deep inside the nose, with a wedge-shaped lens that blends into the fairing.',
      specs: [['Layout', 'Twin lamps'], ['Lens', 'Clear multi-reflector'], ['Placement', 'Integrated in nose']] },
    vi: { name: 'Đèn pha', desc: 'Cụm đèn đôi nằm sâu trong mũi xe, thấu kính hình nêm hòa vào đường nét ốp trước.',
      specs: [['Bố trí', 'Hai bóng'], ['Kính', 'Đa phản xạ trong suốt'], ['Vị trí', 'Tích hợp trong mũi xe']] },
  },
  {
    id: 'handlebar', group: 'cockpit', ja: 'ハンドル & ミラー', view: { az: -35, el: 24, d: 1.0 }, explode: [0.2, 0.8, 0],
    en: { name: 'Handlebar & Mirrors', desc: 'Clip-on style bars set the aggressive riding posture. Wide mirrors sit on the fairing flanks and the clutch and brake levers fall right to hand.',
      specs: [['Bars', 'Aluminium clip-ons'], ['Mirrors', 'Fairing mounted'], ['Controls', 'Adjustable levers']] },
    vi: { name: 'Ghi đông & Gương', desc: 'Ghi đông kẹp tạo tư thế lái thể thao. Gương lớn đặt hai bên ốp, tay côn và tay phanh nằm gọn trong tầm tay.',
      specs: [['Ghi đông', 'Nhôm, kiểu kẹp'], ['Gương', 'Gắn trên ốp'], ['Tay điều khiển', 'Chỉnh được']] },
  },
  {
    id: 'tank', group: 'body', ja: '燃料タンク', view: { az: 28, el: 28, d: 1.0 }, explode: [0.02, 0.72, 0],
    en: { name: 'Fuel Tank & Knee Pads', desc: 'A wide tank carries about 21 litres and houses the airbox. Textured knee pads on each side let the rider grip the bike through corners.',
      specs: [['Capacity', '≈ 21 L'], ['Under tank', 'Airbox & battery'], ['Side pads', 'Textured knee grips']] },
    vi: { name: 'Bình xăng & Đệm gối', desc: 'Bình xăng lớn chứa khoảng 21 lít, bên dưới là hộp lọc gió. Đệm gối nhám hai bên giúp người lái kẹp xe khi vào cua.',
      specs: [['Dung tích', '≈ 21 L'], ['Bên dưới', 'Hộp lọc gió & ắc quy'], ['Đệm hông', 'Nhám chống trượt']] },
  },
  {
    id: 'seat', group: 'body', ja: 'シート', view: { az: -40, el: 28, d: 1.0 }, explode: [-0.25, 0.72, 0],
    en: { name: 'Seat', desc: 'A sculpted rider seat with a pillion pad behind it. The step lets the rider brace under hard acceleration.',
      specs: [['Seat height', '≈ 805 mm'], ['Type', 'Two-piece rider & pillion'], ['Cover', 'Textured vinyl']] },
    vi: { name: 'Yên xe', desc: 'Yên lái tạo hình ôm người cùng đệm ngồi sau. Bậc yên giúp người lái giữ vững khi tăng tốc mạnh.',
      specs: [['Chiều cao yên', '≈ 805 mm'], ['Kiểu', 'Hai phần: lái & phụ'], ['Bọc', 'Giả da nhám']] },
  },
  {
    id: 'side-fairing', group: 'body', ja: 'サイドカウル', view: { az: 8, el: 10, d: 1.0 }, explode: [0, 0, 0], lateral: 0.55,
    en: { name: 'Side Fairings', desc: 'Smooth side panels wrap the engine, shielding the rider from heat and pushing air cleanly around the bike. Each side opens to service the engine.',
      specs: [['Panels', 'Left & right'], ['Function', 'Airflow & heat shield'], ['Livery', 'Model graphics']] },
    vi: { name: 'Ốp hông', desc: 'Các tấm ốp hông ôm động cơ, che nhiệt cho người lái và dẫn gió gọn quanh xe. Mỗi bên tháo ra để bảo dưỡng máy.',
      specs: [['Số tấm', 'Trái & phải'], ['Chức năng', 'Dẫn gió & chắn nhiệt'], ['Tem', 'Họa tiết mô hình']] },
  },
  {
    id: 'tail', group: 'body', ja: 'テールカウル', view: { az: -58, el: 14, d: 1.0 }, explode: [-0.75, 0.35, 0],
    en: { name: 'Tail Section & Lights', desc: 'The long tail tapers to a compact rear with a LED-style tail lamp and indicators, finishing the teardrop profile.',
      specs: [['Tail lamp', 'Twin-lens red'], ['Indicators', 'Integrated'], ['Shape', 'Teardrop taper']] },
    vi: { name: 'Đuôi xe & Đèn hậu', desc: 'Đuôi dài vuốt gọn về phía sau với đèn hậu và xi-nhan tích hợp, hoàn thiện đường nét giọt nước.',
      specs: [['Đèn hậu', 'Hai thấu kính đỏ'], ['Xi-nhan', 'Tích hợp'], ['Dáng', 'Thon giọt nước']] },
  },
  {
    id: 'engine', group: 'power', ja: 'エンジン', view: { az: 25, el: 8, d: 1.0 }, explode: [0, 0, 0],
    en: { name: 'Engine', desc: 'A 1,340 cc liquid-cooled inline-four with DOHC and 16 valves. Huge midrange torque and a broad powerband are its trademark.',
      specs: [['Capacity', '≈ 1,340 cc'], ['Layout', 'Inline-4, DOHC, 16 valves'], ['Power', '≈ 145 kW (197 PS)'], ['Torque', '≈ 155 N·m']] },
    vi: { name: 'Động cơ', desc: 'Máy 4 xi-lanh thẳng hàng 1.340 cc làm mát bằng dung dịch, DOHC 16 van. Mô-men lớn ở dải giữa và dải công suất rộng là dấu ấn của xe.',
      specs: [['Dung tích', '≈ 1.340 cc'], ['Cấu hình', '4 xi-lanh thẳng, DOHC, 16 van'], ['Công suất', '≈ 145 kW (197 PS)'], ['Mô-men', '≈ 155 N·m']] },
  },
  {
    id: 'exhaust', group: 'power', ja: 'マフラー', view: { az: -150, el: 8, d: 1.0 }, explode: [-0.25, 0, 0], lateral: 0.6,
    en: { name: 'Exhaust', desc: 'Large twin mufflers tuck beside the tail. A catalytic system keeps emissions in check while the volume gives the Hayabusa its deep voice.',
      specs: [['Type', 'Twin muffler'], ['Emissions', 'Catalytic converter'], ['Finish', 'Brushed alloy']] },
    vi: { name: 'Ống xả', desc: 'Hai bô lớn đặt cạnh đuôi xe. Bộ xúc tác kiểm soát khí thải, còn dung tích bô tạo nên âm thanh trầm đặc trưng.',
      specs: [['Loại', 'Hai bô'], ['Khí thải', 'Bộ xúc tác'], ['Hoàn thiện', 'Hợp kim chải']] },
  },
  {
    id: 'fork', group: 'chassis', ja: 'フロントフォーク', view: { az: 38, el: 8, d: 1.0 }, explode: [0.5, 0, 0],
    en: { name: 'Front Fork & Fender', desc: 'A stout upside-down fork with radial-mount brake calipers keeps the front end precise under heavy braking. The fender hugs the wheel.',
      specs: [['Fork', 'Inverted telescopic'], ['Brakes', 'Dual disc, radial calipers'], ['Fender', 'Wheel-hugging']] },
    vi: { name: 'Phuộc trước & Chắn bùn', desc: 'Phuộc ngược chắc chắn cùng heo phanh gắn xuyên tâm giữ đầu xe chính xác khi phanh gấp. Chắn bùn ôm theo bánh trước.',
      specs: [['Phuộc', 'Ống lồng ngược'], ['Phanh', 'Đĩa đôi, heo xuyên tâm'], ['Chắn bùn', 'Ôm cung bánh']] },
  },
  {
    id: 'front-wheel', group: 'chassis', ja: 'フロントホイール', view: { az: 42, el: 8, d: 1.0 }, explode: [0.95, 0, 0],
    en: { name: 'Front Wheel & Discs', desc: 'A 17-inch cast alloy wheel with a wide, low-profile tyre and two large drilled discs for stopping power.',
      specs: [['Wheel', '17" cast alloy'], ['Tyre', '≈ 120/70 ZR17'], ['Brakes', 'Dual drilled discs']] },
    vi: { name: 'Bánh trước & Đĩa phanh', desc: 'Mâm đúc 17 inch, lốp bản rộng thấp và hai đĩa phanh đục lỗ lớn cho lực phanh mạnh.',
      specs: [['Mâm', 'Hợp kim đúc 17"'], ['Lốp', '≈ 120/70 ZR17'], ['Phanh', 'Hai đĩa đục lỗ']] },
  },
  {
    id: 'swingarm', group: 'chassis', ja: 'スイングアーム', view: { az: -35, el: 10, d: 1.0 }, explode: [-0.45, 0, 0],
    en: { name: 'Swingarm & Frame', desc: 'A long aluminium swingarm and twin-spar frame deliver the stability needed for the bike’s very high top speed.',
      specs: [['Frame', 'Aluminium twin-spar'], ['Swingarm', 'Long, aluminium'], ['Rear shock', 'Adjustable monoshock']] },
    vi: { name: 'Càng sau & Khung', desc: 'Càng sau nhôm dài và khung nhôm hai thanh mang lại độ ổn định cần thiết cho tốc độ tối đa rất cao.',
      specs: [['Khung', 'Nhôm hai thanh'], ['Càng sau', 'Dài, nhôm'], ['Giảm xóc sau', 'Đơn, chỉnh được']] },
  },
  {
    id: 'rear-wheel', group: 'chassis', ja: 'リアホイール', view: { az: -50, el: 8, d: 1.0 }, explode: [-0.95, 0, 0],
    en: { name: 'Rear Wheel & Brake', desc: 'A very wide 17-inch rear wheel puts huge power on the road, backed by a single rear disc.',
      specs: [['Wheel', '17" cast alloy'], ['Tyre', '≈ 190/50 ZR17'], ['Brake', 'Single rear disc'], ['Drive', 'Chain']] },
    vi: { name: 'Bánh sau & Phanh', desc: 'Mâm sau 17 inch bản rất rộng truyền công suất lớn xuống mặt đường, kèm một đĩa phanh sau.',
      specs: [['Mâm', 'Hợp kim đúc 17"'], ['Lốp', '≈ 190/50 ZR17'], ['Phanh', 'Một đĩa sau'], ['Truyền động', 'Xích']] },
  },
];

export const OVERVIEW = {
  ja: '隼 · ハヤブサ',
  en: { name: 'Hayabusa', desc: 'An interactive 3D model of the Suzuki GSX1300R Hayabusa. Pick a part on the left, or click directly on the bike, to isolate it, zoom in and read the details.',
    specs: [['Engine', '≈ 1,340 cc inline-4'], ['Power', '≈ 145 kW'], ['Weight', '≈ 260 kg'], ['Fuel tank', '≈ 21 L']] },
  vi: { name: 'Hayabusa', desc: 'Mô hình 3D tương tác của Suzuki GSX1300R Hayabusa. Chọn một bộ phận bên trái hoặc bấm trực tiếp lên xe để tách riêng, phóng to và xem chi tiết.',
    specs: [['Động cơ', '≈ 1.340 cc, 4 xi-lanh'], ['Công suất', '≈ 145 kW'], ['Khối lượng', '≈ 260 kg'], ['Bình xăng', '≈ 21 L']] },
};

export const UI = {
  en: {
    hint: 'DRAG to orbit · SCROLL to zoom · CLICK a part', color: 'COLOR', overview: 'Overview', tagOverview: 'OVERVIEW',
    front: 'Front', side: 'Side', rear: 'Rear', top: 'Top', explode: 'EXPLODE', spin: 'Spin', isolate: 'Isolate', wire: 'Wire',
    ride: 'Test ride', shot: 'Capture', foot: 'Specs are for reference only', loading: 'ASSEMBLING', prev: 'Previous part', next: 'Next part',
    credit: '3D model: “Suzuki Hayabusa” by JUSTGAME · CC BY 4.0',
    tSpin: 'Auto rotate (Space)', tIso: 'Fade other parts', tWire: 'Wireframe', tRide: 'Test ride (R)', tShot: 'Save transparent PNG',
  },
  vi: {
    hint: 'KÉO để xoay · CUỘN để zoom · CLICK vào bộ phận', color: 'MÀU SẮC', overview: 'Toàn cảnh', tagOverview: 'TỔNG QUAN',
    front: 'Trước', side: 'Hông', rear: 'Sau', top: 'Trên', explode: 'TÁCH RỜI', spin: 'Xoay', isolate: 'Cô lập', wire: 'Lưới',
    ride: 'Chạy thử', shot: 'Chụp', foot: 'Thông số mang tính tham khảo', loading: 'ĐANG LẮP RÁP', prev: 'Bộ phận trước', next: 'Bộ phận kế tiếp',
    credit: 'Mô hình 3D: “Suzuki Hayabusa” của JUSTGAME · CC BY 4.0',
    tSpin: 'Xoay tự động (Space)', tIso: 'Làm mờ bộ phận khác', tWire: 'Khung lưới', tRide: 'Chạy thử (R)', tShot: 'Lưu PNG nền trong',
  },
};
