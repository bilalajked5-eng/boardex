#!/usr/bin/env python3
"""Adds the v2 information-architecture content (demo structure) to content.{ar,en}.json.
Idempotent: re-running overwrites the same keys. Existing SEO H1/meta strings are kept."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = os.path.join(ROOT, 'src/data')

def load(l): return json.load(open(f'{D}/content.{l}.json', encoding='utf-8'))
def save(l, d):
    with open(f'{D}/content.{l}.json', 'w', encoding='utf-8') as f: json.dump(d, f, ensure_ascii=False, indent=2); f.write('\n')
def deep(d, path, val):
    cur = d
    for k in path[:-1]: cur = cur.setdefault(k, {})
    cur[path[-1]] = val

EN, AR = load('en'), load('ar')

# ---------------------------------------------------------------- UI
deep(EN, ['ui', 'nav', 'gallery'], 'Gallery'); deep(AR, ['ui', 'nav', 'gallery'], 'المعرض')
deep(EN, ['ui', 'nav', 'contact'], 'Contact'); deep(AR, ['ui', 'nav', 'contact'], 'تواصل معنا')
deep(EN, ['ui', 'nav', 'overview'], 'Overview'); deep(AR, ['ui', 'nav', 'overview'], 'نظرة عامة')
deep(EN, ['ui', 'nav', 'groups'], {'corporates': 'Corporate catering', 'celebrations': 'Celebrations & events', 'b2b': 'Product families'})
deep(AR, ['ui', 'nav', 'groups'], {'corporates': 'تموين الشركات', 'celebrations': 'الحفلات والمناسبات', 'b2b': 'فئات المنتجات'})
deep(EN, ['ui', 'nav', 'utility'], {'location': 'Riyadh central kitchen · Enquiries across Saudi Arabia', 'phone': 'Phone', 'open': 'Open menu'})
deep(AR, ['ui', 'nav', 'utility'], {'location': 'مطبخ مركزي في الرياض · نستقبل الطلبات من جميع أنحاء المملكة', 'phone': 'الهاتف', 'open': 'فتح القائمة'})
deep(EN, ['ui', 'nav', 'submenu'], 'Open submenu'); deep(AR, ['ui', 'nav', 'submenu'], 'فتح القائمة الفرعية')

EN['ui']['cta'].update({'quoteShort': 'Get a Quote', 'enquire': 'Enquire', 'talk': 'Talk to our team', 'exploreService': 'Explore service', 'browseRange': 'Browse range', 'requestQuotation': 'Request a quotation', 'contactDetails': 'Contact details', 'backToServices': 'Back to all services', 'allFamilies': 'Explore all seven families', 'askProduct': 'Ask about this product', 'tailoredQuote': 'Request a tailored quote', 'enquireRange': 'Enquire about this range', 'planEvent': 'Plan an event', 'exploreB2B': 'Explore B2B supply', 'viewFuture': 'View future service plans', 'showAll': 'Show all products', 'seeAll': 'See all', 'openPdf': 'Open the official PDF catalogue', 'call': 'Call', 'openWhatsapp': 'Open WhatsApp', 'openForm': 'Open the enquiry form', 'exploreGallery': 'Explore the gallery', 'meetPlum': 'Meet Plum Catering', 'browseAll': 'Browse all products'})
AR['ui']['cta'].update({'quoteShort': 'اطلب عرض سعر', 'enquire': 'استفسر', 'talk': 'تحدث مع فريقنا', 'exploreService': 'استكشف الخدمة', 'browseRange': 'تصفّح المجموعة', 'requestQuotation': 'اطلب عرض سعر', 'contactDetails': 'بيانات التواصل', 'backToServices': 'العودة إلى كل الخدمات', 'allFamilies': 'استكشف الفئات السبع', 'askProduct': 'استفسر عن هذا المنتج', 'tailoredQuote': 'اطلب عرض سعر مخصصًا', 'enquireRange': 'استفسر عن هذه المجموعة', 'planEvent': 'خطط لمناسبة', 'exploreB2B': 'استكشف التوريد للأعمال', 'viewFuture': 'اطّلع على الخدمات المستقبلية', 'showAll': 'عرض كل المنتجات', 'seeAll': 'عرض الكل', 'openPdf': 'افتح كتالوج PDF الرسمي', 'call': 'اتصل', 'openWhatsapp': 'افتح واتساب', 'openForm': 'افتح نموذج الاستفسار', 'exploreGallery': 'استكشف المعرض', 'meetPlum': 'تعرّف على بلام للتموين', 'browseAll': 'تصفّح كل المنتجات'})

EN['ui']['quote'].update({'stepLabel': 'Step {n} of {total}', 'steps': ['Your enquiry', 'Details', 'Your contact'], 'back': 'Back', 'next': 'Continue', 'category': 'Enquiry category', 'detail': 'Service', 'detailPlaceholder': 'Choose a service (optional)', 'interest': 'What are you planning?', 'interestHint': 'For example: a staff iftar for 120, weekly croissant supply', 'quantity': 'Approximate guest count or quantity', 'quantityHint': 'e.g. 150 guests or 500 units per week', 'city': 'City / venue location', 'preferredDate': 'Preferred date', 'preferredDateHint': 'A date, or a frequency such as “weekly”', 'format': 'Service or buying format', 'formatNotDecided': 'Not decided yet', 'formats': {'buffet': 'Buffet', 'served': 'Served meal', 'boxes': 'Meal boxes', 'reception': 'Reception / canapés', 'live': 'Live station', 'recurring': 'Recurring supply', 'oneTime': 'One-time product supply'}, 'summaryTitle': 'Your enquiry', 'eyebrow': 'Request a quotation'})
AR['ui']['quote'].update({'stepLabel': 'الخطوة {n} من {total}', 'steps': ['استفسارك', 'التفاصيل', 'بيانات التواصل'], 'back': 'رجوع', 'next': 'متابعة', 'category': 'نوع الاستفسار', 'detail': 'الخدمة', 'detailPlaceholder': 'اختر الخدمة (اختياري)', 'interest': 'ماذا تخطط؟', 'interestHint': 'مثلًا: إفطار للموظفين لـ120 شخصًا، أو توريد كرواسون أسبوعي', 'quantity': 'العدد التقريبي للضيوف أو الكمية', 'quantityHint': 'مثلًا: 150 ضيفًا أو 500 وحدة أسبوعيًا', 'city': 'المدينة / موقع المناسبة', 'preferredDate': 'التاريخ المفضل', 'preferredDateHint': 'تاريخ محدد، أو وتيرة مثل «أسبوعيًا»', 'format': 'أسلوب الخدمة أو الشراء', 'formatNotDecided': 'لم يُحدَّد بعد', 'formats': {'buffet': 'بوفيه', 'served': 'وجبة مقدَّمة على الطاولات', 'boxes': 'علب وجبات', 'reception': 'استقبال / كانابيه', 'live': 'محطة طهي مباشر', 'recurring': 'توريد متكرر', 'oneTime': 'توريد لمرة واحدة'}, 'summaryTitle': 'استفسارك', 'eyebrow': 'اطلب عرض سعر'})

EN['ui']['footer'].update({'explore': 'Explore', 'discover': 'Discover', 'kitchen': 'Our Kitchen', 'brandLine': 'A brand of {parent} · Riyadh, Saudi Arabia', 'brandLineNoParent': 'Riyadh, Saudi Arabia'})
AR['ui']['footer'].update({'explore': 'استكشف', 'discover': 'اكتشف', 'kitchen': 'مطبخنا', 'brandLine': 'علامة تابعة لـ{parent} · الرياض، المملكة العربية السعودية', 'brandLineNoParent': 'الرياض، المملكة العربية السعودية'})
EN['ui']['floating'] = {'label': 'Quick actions'}; AR['ui']['floating'] = {'label': 'إجراءات سريعة'}
EN['ui']['stats'] = {'label': 'Key facts'}; AR['ui']['stats'] = {'label': 'حقائق أساسية'}
EN['ui']['gallery']['collections'] = {'all': 'All', 'corporates': 'Events', 'celebrations': 'Celebrations', 'kitchen': 'Kitchen', 'b2b': 'Food & bakery'}
AR['ui']['gallery']['collections'] = {'all': 'الكل', 'corporates': 'الفعاليات', 'celebrations': 'المناسبات', 'kitchen': 'المطبخ', 'b2b': 'الطعام والمخبوزات'}

# ---------------------------------------------------------------- HOME v2
EN['pages']['home'].update({
  'hero': {**EN['pages']['home']['hero'], 'eyebrow': 'Catering · Hospitality · B2B Supply', 'accent': 'for Businesses and Celebrations',
           'lead': 'From corporate gatherings and private celebrations to bakery supply for hospitality businesses, Plum brings considered food and coordinated service to the table. Enquiries across Saudi Arabia are welcome, with location coverage confirmed individually.',
           'meta': ['Riyadh central kitchen', 'Saudi enquiries · coverage confirmed per request'], 'panelLabel': 'The food experience', 'panelText': 'Made to bring us together.', 'panelNote': 'Brand film / editorial visual area'},
  'stats': {'pillars': {'value': '3', 'label': 'Core pillars — catering, celebrations and B2B'}, 'kitchenLabel': 'Central kitchen in Riyadh', 'certLabel': 'Food-safety certification listed on the current site', 'productsLabel': 'Catalogue products'},
  'start': {'eyebrow': 'Start with your needs', 'h2': 'Choose your starting point', 'intro': 'A clear route for every kind of visitor. Whether you are planning an event or sourcing baked goods for a business, start where your needs fit best.',
            'cards': [{'num': '01', 'label': 'For organizations', 'h3': 'Corporate Catering', 'body': 'Meetings, official occasions, healthcare, education, worksites and corporate meals.', 'cta': 'Explore Corporate Catering', 'key': 'corporates'},
                      {'num': '02', 'label': 'For occasions', 'h3': 'Celebrations & Events', 'body': 'Weddings, private occasions, Ramadan hospitality, VIP service and receptions.', 'cta': 'Explore Celebrations', 'key': 'celebrations'},
                      {'num': '03', 'label': 'For businesses', 'h3': 'B2B Bakery & Pastry', 'body': 'Browse 76 products in seven bakery and dessert families, with a direct supply enquiry.', 'cta': 'Explore the Catalogue', 'key': 'b2b'}]},
  'about': {**EN['pages']['home']['about'], 'eyebrow': 'About Plum', 'h2': 'About Plum Catering', 'h2alt': 'A kitchen-led hospitality business',
            'body2': 'Our approach is straightforward: understand the occasion, plan the details and serve food that feels appropriate to the people around the table.',
            'approachLabel': 'Our approach', 'approachSteps': ['Listen to the brief', 'Develop the menu', 'Plan the service', 'Deliver the occasion']},
  'explore': {'eyebrow': 'Services / two event pillars', 'h2': 'Our Catering Services', 'intro': 'Explore every catering service — each with its own page, approach and enquiry path.', 'seeAll': 'See all {name} services'},
  'b2bBlock': {'eyebrow': 'B2B / trade partners', 'h2': 'B2B Supply', 'h2alt': 'Supplying the hospitality trade', 'lead': 'A catalogue made for hospitality buyers, not an online shop. Find your product family, compare the range and send one clear sourcing enquiry.', 'meta': '76 products · 7 families · quote-based supply'},
  'how': {'eyebrow': 'How we work', 'h2': 'From first enquiry to the table', 'steps': [
      {'h3': 'Share your plans', 'body': 'Tell us the occasion, location, date and guest count, or your business supply requirements.'},
      {'h3': 'Shape the proposal', 'body': 'Discuss available menus, product families, serving formats or supply needs with the team.'},
      {'h3': 'Confirm the details', 'body': 'Agree the proposed scope, timing and practical arrangements before an order is confirmed.'},
      {'h3': 'Bring it together', 'body': 'Food preparation and coordinated service follow the confirmed arrangement.'}]},
  'cuisine': {**EN['pages']['home']['cuisine'], 'eyebrow': 'Cuisine inspiration', 'h2alt': 'A menu with room for the world', 'body': 'Cuisine inspirations seen in Plum’s current portfolio. Specific combinations and menus are discussed during the quotation process.',
              'chips': ['Saudi', 'Lebanese', 'Egyptian', 'Persian', 'Mediterranean', 'Indian', 'Burger & Grill', 'Italian', 'International', 'Fusion', 'Desserts & Pastries'],
              'pendingNote': 'Cuisine list taken from the client’s design concept; confirm each cuisine is actually served before publication.'},
  'audiences': {'eyebrow': 'Who we serve', 'h2': 'Built for different audiences', 'items': ['Corporate teams', 'Government & institutions', 'Banks & offices', 'Hospitals & clinics', 'Schools & universities', 'Industrial businesses', 'Exhibitions & events', 'Hotels, restaurants & cafés']},
  'clients': {**EN['pages']['home']['clients'], 'eyebrow': 'Client logo wall', 'h2alt': 'Partnerships built on trust', 'intro': 'This is the placement for approved client logos. The final website displays only clients who have authorized public logo use.'},
  'future': {'eyebrow': 'Future expansion', 'h2': 'One more service line is being prepared', 'num': '04', 'label': 'Future services',
             'body1': 'Facility Management is a future offering, separate from the three active catering and B2B pillars.',
             'body2': 'Pest control and cleaning, linen and laundry, housekeeping, site maintenance and landscaping are shown as Coming Soon — never as active services.',
             'statusLabel': 'Status', 'status': 'Coming soon.', 'statusBody': 'No bookings or orders are being taken for these services.'},
  'work': {**EN['pages']['home']['work'], 'eyebrow': 'Our work', 'h2alt': 'A closer look at Plum at work', 'intro': 'Real work should speak louder than stock imagery. Approved kitchen and event media is organized into curated collections on the gallery page.'},
  'faq': {**EN['pages']['home']['faq'], 'eyebrow': 'Good to know', 'h2alt': 'Questions before you enquire'},
  'finalCta': {**EN['pages']['home']['finalCta'], 'eyebrow': 'Let’s talk', 'h2alt': 'Let’s plan something worth gathering for', 'body': 'Tell us the occasion, the people and where it will take place. We’ll help you start the conversation.'},
})
AR['pages']['home'].update({
  'hero': {**AR['pages']['home']['hero'], 'eyebrow': 'تموين · ضيافة · توريد للأعمال', 'accent': 'للشركات والمناسبات',
           'lead': 'من فعاليات الشركات والمناسبات الخاصة إلى توريد المخبوزات لمنشآت الضيافة، تقدّم بلام طعامًا مدروسًا وخدمة منسّقة إلى مائدتك. نرحّب بالطلبات من جميع أنحاء المملكة، مع تأكيد التغطية لكل طلب على حدة.',
           'meta': ['مطبخ مركزي في الرياض', 'طلبات من داخل المملكة · تُؤكَّد التغطية لكل طلب'], 'panelLabel': 'تجربة الطعام', 'panelText': 'صُنع ليجمعنا.', 'panelNote': 'فيلم العلامة / مساحة بصرية تحريرية'},
  'stats': {'pillars': {'value': '3', 'label': 'ركائز أساسية — التموين والمناسبات وقطاع الأعمال'}, 'kitchenLabel': 'مطبخ مركزي في الرياض', 'certLabel': 'شهادة سلامة غذاء مذكورة في الموقع الحالي', 'productsLabel': 'منتجًا في الكتالوج'},
  'start': {'eyebrow': 'ابدأ من احتياجك', 'h2': 'اختر نقطة البداية', 'intro': 'مسار واضح لكل زائر. سواء كنت تخطط لمناسبة أو تبحث عن مخبوزات لمنشأتك، ابدأ من المكان الأنسب لاحتياجك.',
            'cards': [{'num': '01', 'label': 'للجهات والمؤسسات', 'h3': 'تموين الشركات', 'body': 'الاجتماعات والمناسبات الرسمية والقطاع الصحي والتعليمي ومواقع العمل ووجبات الموظفين.', 'cta': 'استكشف تموين الشركات', 'key': 'corporates'},
                      {'num': '02', 'label': 'للمناسبات', 'h3': 'الحفلات والمناسبات', 'body': 'حفلات الزفاف والمناسبات الخاصة وضيافة رمضان وخدمة كبار الضيوف والاستقبالات.', 'cta': 'استكشف المناسبات', 'key': 'celebrations'},
                      {'num': '03', 'label': 'للمنشآت التجارية', 'h3': 'مخبوزات ومعجنات لقطاع الأعمال', 'body': 'تصفّح 76 منتجًا في سبع فئات من المخبوزات والحلويات، مع طلب توريد مباشر.', 'cta': 'استكشف الكتالوج', 'key': 'b2b'}]},
  'about': {**AR['pages']['home']['about'], 'eyebrow': 'عن بلام', 'h2': 'تعرّف على بلام للتموين', 'h2alt': 'أعمال ضيافة يقودها المطبخ',
            'body2': 'نهجنا بسيط: نفهم المناسبة، ونخطط للتفاصيل، ونقدّم طعامًا يليق بمن حول المائدة.',
            'approachLabel': 'نهجنا', 'approachSteps': ['نستمع إلى طلبك', 'نطوّر القائمة', 'نخطط للخدمة', 'ننفّذ المناسبة']},
  'explore': {'eyebrow': 'الخدمات / ركيزتا المناسبات', 'h2': 'خدمات التموين والإعاشة', 'intro': 'استكشف كل خدمة تموين — لكل منها صفحة ونهج ومسار استفسار خاص.', 'seeAll': 'عرض كل خدمات {name}'},
  'b2bBlock': {'eyebrow': 'قطاع الأعمال / شركاء التجارة', 'h2': 'توريد المنتجات لقطاع الأعمال', 'h2alt': 'نورّد لقطاع الضيافة', 'lead': 'كتالوج صُمم لمشتري قطاع الضيافة، لا متجرًا إلكترونيًا. اعثر على فئة المنتج، وقارن المجموعة، وأرسل طلب توريد واحدًا واضحًا.', 'meta': '76 منتجًا · 7 فئات · توريد بعرض سعر'},
  'how': {'eyebrow': 'كيف نعمل', 'h2': 'من الاستفسار الأول إلى المائدة', 'steps': [
      {'h3': 'شاركنا خططك', 'body': 'أخبرنا عن المناسبة والموقع والتاريخ وعدد الضيوف، أو عن احتياجات التوريد لمنشأتك.'},
      {'h3': 'نصوغ العرض', 'body': 'ناقش مع الفريق القوائم المتاحة وفئات المنتجات وأساليب التقديم أو احتياجات التوريد.'},
      {'h3': 'نؤكد التفاصيل', 'body': 'نتفق على النطاق المقترح والتوقيت والترتيبات العملية قبل تأكيد الطلب.'},
      {'h3': 'ننفّذ', 'body': 'يتم تحضير الطعام وتنسيق الخدمة وفق الترتيب المتفق عليه.'}]},
  'cuisine': {**AR['pages']['home']['cuisine'], 'eyebrow': 'إلهام المطابخ', 'h2alt': 'قائمة تتسع للعالم', 'body': 'مطابخ مستوحاة من أعمال بلام الحالية. تُناقش التوليفات والقوائم المحددة أثناء إعداد عرض السعر.',
              'chips': ['سعودي', 'لبناني', 'مصري', 'فارسي', 'متوسطي', 'هندي', 'برغر وشواء', 'إيطالي', 'عالمي', 'فيوجن', 'حلويات ومعجنات'],
              'pendingNote': 'قائمة المطابخ مأخوذة من تصور العميل التصميمي؛ يرجى تأكيد كل مطبخ يُقدَّم فعليًا قبل النشر.'},
  'audiences': {'eyebrow': 'من نخدم', 'h2': 'مصمم لجمهور متنوع', 'items': ['فرق الشركات', 'الجهات الحكومية والمؤسسات', 'البنوك والمكاتب', 'المستشفيات والعيادات', 'المدارس والجامعات', 'المنشآت الصناعية', 'المعارض والفعاليات', 'الفنادق والمطاعم والمقاهي']},
  'clients': {**AR['pages']['home']['clients'], 'eyebrow': 'شعارات العملاء', 'h2alt': 'شراكات مبنية على الثقة', 'intro': 'هذا هو موضع شعارات العملاء المعتمدة. يعرض الموقع النهائي فقط العملاء الذين أذنوا باستخدام شعاراتهم علنًا.'},
  'future': {'eyebrow': 'توسّع مستقبلي', 'h2': 'خدمة جديدة قيد الإعداد', 'num': '04', 'label': 'خدمات مستقبلية',
             'body1': 'إدارة المرافق خدمة مستقبلية منفصلة عن الركائز الثلاث القائمة للتموين وقطاع الأعمال.',
             'body2': 'تُعرض مكافحة الحشرات والنظافة والبياضات والغسيل والإشراف الداخلي وصيانة المواقع وتنسيق الحدائق على أنها قريبًا — وليست خدمات قائمة.',
             'statusLabel': 'الحالة', 'status': 'قريبًا.', 'statusBody': 'لا تُستقبل حجوزات أو طلبات لهذه الخدمات حاليًا.'},
  'work': {**AR['pages']['home']['work'], 'eyebrow': 'من أعمالنا', 'h2alt': 'نظرة أقرب على عمل بلام', 'intro': 'العمل الحقيقي أبلغ من الصور الجاهزة. تُنظَّم صور المطبخ والفعاليات المعتمدة في مجموعات منسّقة في صفحة المعرض.'},
  'faq': {**AR['pages']['home']['faq'], 'eyebrow': 'معلومات مفيدة', 'h2alt': 'أسئلة قبل الاستفسار'},
  'finalCta': {**AR['pages']['home']['finalCta'], 'eyebrow': 'لنتحدث', 'h2alt': 'لنخطط لما يستحق أن نجتمع لأجله', 'body': 'أخبرنا عن المناسبة والحضور والمكان، وسنساعدك على بدء الحوار.'},
})

# ---------------------------------------------------------------- SERVICE HUB + SUB-PAGES
EN['pages']['serviceHub'] = {'findEyebrow': 'Service categories', 'findH2': 'Find the service that fits', 'findIntro': 'Choose a service to explore its approach, what to discuss and the details needed for a tailored quotation.',
  'briefEyebrow': 'How it works', 'briefH3': 'What we plan together', 'briefBody': 'Every occasion has its own rhythm. The team will need the guest count, venue, preferred date and style of service to assess the request and prepare a relevant proposal.',
  'briefItems': ['Purpose and audience', 'Guest count, location and event timing', 'Cuisine and serving preferences', 'Practical requirements and quotation'],
  'processLabel': 'Service process', 'process': ['Discuss the brief', 'Review menu options', 'Confirm the event plan'], 'faqEyebrow': 'Your questions', 'ctaEyebrow': 'Let’s talk', 'ctaH2': 'Make the next event easier to plan', 'ctaBody': 'Tell us your requirements and start with a clear conversation.', 'panelCountry': 'Saudi Arabia'}
AR['pages']['serviceHub'] = {'findEyebrow': 'فئات الخدمة', 'findH2': 'اعثر على الخدمة المناسبة', 'findIntro': 'اختر خدمة لتتعرف على نهجها وما يمكن مناقشته والتفاصيل المطلوبة لعرض سعر مخصص.',
  'briefEyebrow': 'كيف تتم الخدمة', 'briefH3': 'ما نخطط له معًا', 'briefBody': 'لكل مناسبة إيقاعها. يحتاج الفريق إلى عدد الضيوف والمكان والتاريخ المفضل وأسلوب الخدمة لتقييم الطلب وإعداد عرض مناسب.',
  'briefItems': ['الغرض والجمهور', 'عدد الضيوف والموقع وتوقيت المناسبة', 'المطابخ وتفضيلات التقديم', 'المتطلبات العملية وعرض السعر'],
  'processLabel': 'مراحل الخدمة', 'process': ['مناقشة الطلب', 'مراجعة خيارات القائمة', 'تأكيد خطة المناسبة'], 'faqEyebrow': 'أسئلتك', 'ctaEyebrow': 'لنتحدث', 'ctaH2': 'اجعل مناسبتك القادمة أسهل في التخطيط', 'ctaBody': 'أخبرنا بمتطلباتك وابدأ بحوار واضح.', 'panelCountry': 'المملكة العربية السعودية'}

EN['pages']['servicePage'] = {'eyebrowSuffix': 'Service', 'serviceLabel': 'The service', 'builtEyebrow': 'Your service', 'builtH2': 'Built around your requirements', 'whoH3': 'Who this service is for',
  'enquiryEyebrow': 'A good enquiry includes', 'enquiryItems': ['What you are planning', 'Guest count or required quantity', 'Date, city and venue', 'Menu and service preferences'],
  'optionsEyebrow': 'Service options', 'optionsH2': 'What you can discuss', 'optionBody': 'Discuss this requirement in your brief so the team can assess the right approach and quotation.',
  'planEyebrow': 'Step by step', 'planH2': 'How we would plan it', 'faqEyebrow': 'Good to know', 'faqH2': 'Before you get in touch',
  'relatedEyebrow': 'Related services', 'relatedH2': 'You may also be looking for', 'ctaH2': 'Start with the right details', 'ctaBody': 'Tell us about the occasion, location and quantity. We’ll discuss a relevant proposal.'}
AR['pages']['servicePage'] = {'eyebrowSuffix': 'خدمة', 'serviceLabel': 'الخدمة', 'builtEyebrow': 'خدمتك', 'builtH2': 'مصممة حول متطلباتك', 'whoH3': 'لمن هذه الخدمة',
  'enquiryEyebrow': 'الاستفسار الجيد يتضمن', 'enquiryItems': ['ما الذي تخطط له', 'عدد الضيوف أو الكمية المطلوبة', 'التاريخ والمدينة والمكان', 'تفضيلات القائمة والخدمة'],
  'optionsEyebrow': 'خيارات الخدمة', 'optionsH2': 'ما يمكنك مناقشته', 'optionBody': 'اذكر هذا المتطلب في طلبك ليتمكن الفريق من تقييم النهج الأنسب وإعداد عرض السعر.',
  'planEyebrow': 'خطوة بخطوة', 'planH2': 'كيف نخطط لها', 'faqEyebrow': 'معلومات مفيدة', 'faqH2': 'قبل أن تتواصل معنا',
  'relatedEyebrow': 'خدمات ذات صلة', 'relatedH2': 'قد تبحث أيضًا عن', 'ctaH2': 'ابدأ بالتفاصيل الصحيحة', 'ctaBody': 'أخبرنا عن المناسبة والموقع والكمية، وسنناقش معك عرضًا مناسبًا.'}

CORP_EN = [
 ('corporate-events', 'Corporate & Business Catering', 'Well-planned food service for meetings, conferences, launches and business gatherings.', 'Companies, agencies, co-working communities and event organisers planning business occasions.',
  ['Meeting and boardroom lunches', 'Conference and seminar catering', 'Product launches and client hospitality', 'Staff celebrations and town halls'],
  ['Clarify the format, attendance and timing', 'Review menu style, service format and venue access', 'Confirm the plan and request a tailored proposal'],
  [('Can catering be arranged for recurring meetings?', 'Yes. Recurring arrangements are discussed during planning, including menus, quantities and delivery schedules.', True), ('Do you provide service staff for business events?', 'Service options are agreed per event according to the format and venue.', True)]),
 ('government-official', 'Royal & Government Catering', 'Considered hospitality for formal, institutional and protocol-led events.', 'Ministries, public bodies, diplomatic hosts and official event coordinators.',
  ['Official receptions and ceremonies', 'Protocol-led dinners and hosted delegations', 'Conferences and public-sector forums', 'National-day and institutional occasions'],
  ['Understand the protocol, programme and guest profile', 'Align menu, service sequence and setup with the organisers', 'Confirm logistics and request a tailored proposal'],
  [('How early should official events be planned?', 'As early as possible. Formal events benefit from time to align protocol, approvals and logistics.', True), ('Can you coordinate with our protocol team?', 'Yes. Service sequence, timings and presentation are aligned with your organisers before the event.', False)]),
 ('healthcare', 'Hospitals & Clinics Catering', 'Practical catering conversations for healthcare teams, meetings and institutional occasions.', 'Hospitals, clinics, medical offices and healthcare event coordinators.',
  ['Staff and administrative meeting catering', 'Healthcare seminars and events', 'Planned workplace meal arrangements', 'Flexible enquiry-based serving formats'],
  ['Clarify the site type, purpose and number of meals', 'Review timing, food preferences and delivery requirements', 'Confirm feasibility and request a tailored proposal'],
  [('Is this service for clinical or prescribed patient diets?', 'Clinical and dietary menu specifications must be agreed with your facility team before any service begins.', True), ('Can recurring arrangements be discussed?', 'Yes. Recurring meal programmes are planned with your team around schedules and service points.', True)]),
 ('industrial-sites', 'Industrial & Remote-Site Catering', 'Meals planned around demanding work schedules and site requirements.', 'Contractors, industrial operators, project camps and site managers.',
  ['Daily workforce meal programmes', 'Shift-based meal timing', 'Packed meals for crews on the move', 'Site mobilisation and project-phase catering'],
  ['Clarify the site, headcount and shift pattern', 'Review delivery access, timing and service model', 'Confirm coverage and request a tailored proposal'],
  [('Do you serve sites outside Riyadh?', 'Coverage is confirmed per site. Share the location in your enquiry.', True), ('Can quantities change week to week?', 'Changes in headcount are discussed as part of the recurring arrangement.', True)]),
 ('education', 'Schools & Universities Catering', 'Food-service planning for educational events and institutional communities.', 'Schools, universities, training institutes and campus event teams.',
  ['Daily campus dining arrangements', 'Graduation ceremonies and open days', 'Faculty meetings and academic conferences', 'Student events and activity days'],
  ['Understand the institution, calendar and numbers', 'Review menus suitable for the audience and setting', 'Confirm timing and request a tailored proposal'],
  [('Can menus be adapted for younger students?', 'Menus are proposed for your approval and can be adapted to the audience.', False), ('Do you cater term-long programmes?', 'Recurring programmes are discussed with your administration around the academic calendar.', True)]),
 ('meal-boxes', 'Corporate Meal Boxes', 'Individually portioned meal formats for working days and organized occasions.', 'Teams, training organisers, site visits and events that need individually packed meals.',
  ['Boxed lunches for meetings and training days', 'Breakfast boxes for early starts', 'Individually packed event meals', 'Recurring weekly box programmes'],
  ['Clarify quantities, timing and delivery point', 'Review box contents and any menu preferences', 'Confirm the schedule and request a tailored proposal'],
  [('Is there a minimum order for meal boxes?', 'Share your expected quantity in the enquiry and the team will advise.', True), ('Can boxes be labelled per guest?', 'Labelling and presentation options are discussed during planning.', True)]),
 ('corporate-ramadan', 'Corporate Ramadan Catering', 'Iftar and suhoor hospitality arranged around organizations and teams.', 'Organisations hosting staff iftars, client suhoors and Ramadan gatherings.',
  ['Staff iftar gatherings', 'Hosted client and partner iftars', 'Suhoor service for night-shift teams', 'Ramadan meal boxes and distributions'],
  ['Clarify the date, numbers and venue early', 'Review the menu and service style for the gathering', 'Confirm timing around iftar and request a tailored proposal'],
  [('How early should Ramadan catering be booked?', 'Ramadan is a peak season. Early planning is strongly recommended.', True), ('Can you cater iftar at our offices?', 'Yes. Venue access and setup are confirmed during planning.', False)]),
]
CEL_EN = [
 ('weddings-engagements', 'Wedding & Engagement Catering', 'Celebration menus and hospitality built around a meaningful occasion.', 'Couples, families and wedding planners preparing engagements and weddings.',
  ['Served dinners and buffets', 'Welcome receptions and canapé service', 'Dessert and sweet tables', 'Late-evening and after-party food'],
  ['Understand the programme, guests and venue', 'Shape the menu, presentation and service style', 'Confirm the timeline and request a tailored proposal'],
  [('How early should we book for a wedding?', 'Weddings and peak-season dates benefit from early planning. Share your date as soon as you can.', True), ('Can the menu reflect family traditions?', 'Yes. Menus are proposed around your guests and traditions and adjusted before confirmation.', False)]),
 ('private-occasions', 'Private Occasion Catering', 'Thoughtful menus for family moments, gatherings and celebrations.', 'Families and private hosts celebrating birthdays, graduations, gatherings and home receptions.',
  ['Family gatherings and home receptions', 'Birthdays and graduations', 'Intimate dinners', 'Seasonal and holiday celebrations'],
  ['Understand the occasion, numbers and setting', 'Review menu options and service style', 'Confirm the details and request a tailored proposal'],
  [('Do you cater small private gatherings?', 'Share your expected guest count and the team will advise on suitable options.', True), ('Can you deliver and set up at home?', 'Setup and service options are agreed per occasion.', True)]),
 ('ramadan-events', 'Ramadan Iftar & Suhoor Catering', 'Welcoming Ramadan tables for private gatherings and hosted occasions.', 'Families and hosts planning iftar and suhoor gatherings for relatives, friends and guests.',
  ['Family iftar tables', 'Hosted suhoor evenings', 'Ramadan majlis hospitality', 'Larger community iftars'],
  ['Clarify the date, guests and venue early', 'Shape the iftar or suhoor menu', 'Confirm timings around iftar and request a tailored proposal'],
  [('How far in advance should Ramadan gatherings be booked?', 'Ramadan is a busy season; early planning is recommended.', True), ('Can you serve traditional Ramadan dishes?', 'Menus are proposed around your preferences and confirmed before the event.', True)]),
 ('vip-luxury', 'Luxury & VIP Catering', 'Discreet, considered food presentation for exceptional hosted occasions.', 'Hosts of distinguished guests, private dinners and high-profile occasions.',
  ['Fine-dining served menus', 'Discreet attentive service', 'Refined presentation and styling', 'Private chef-led experiences'],
  ['Understand the guests, setting and expectations', 'Design the menu, presentation and service flow', 'Confirm every detail and request a tailored proposal'],
  [('Can menus be fully bespoke?', 'Yes. VIP menus are designed around the occasion and confirmed with you.', False), ('Is discreet service available?', 'Service style, including discretion and timing, is planned with you.', True)]),
 ('live-stations', 'Live Cooking Stations', 'Freshly prepared food experiences that become part of the occasion.', 'Events where guests enjoy chef-attended stations as part of the experience.',
  ['Chef-attended cooking stations', 'Grill and carving stations', 'Dessert and pastry stations', 'Interactive themed stations'],
  ['Understand the venue, space and guest flow', 'Select stations and menus for the occasion', 'Confirm setup needs and request a tailored proposal'],
  [('What does a live station need from the venue?', 'Space, access and setup needs are confirmed during planning.', True), ('Can stations be combined with a buffet?', 'Yes. Service formats can be combined according to your programme.', False)]),
 ('canapes-receptions', 'Canapés & Reception Catering', 'Elegant small bites and practical service for guests who mingle.', 'Receptions, openings, standing events and welcome gatherings.',
  ['Passed canapés', 'Styled grazing displays', 'Reception drinks and refreshments', 'Short-format welcome gatherings'],
  ['Understand the format, duration and numbers', 'Select canapé menus and presentation', 'Confirm the service plan and request a tailored proposal'],
  [('How many canapés per guest?', 'Quantities are advised according to the format and duration of your reception.', True), ('Can canapés be served by staff?', 'Service options are agreed per event.', True)]),
]
CORP_AR = [
 ('corporate-events', 'تموين الشركات والأعمال', 'خدمة طعام مخططة بعناية للاجتماعات والمؤتمرات وإطلاق المنتجات وتجمعات الأعمال.', 'الشركات والوكالات ومجتمعات العمل المشترك ومنظمو فعاليات الأعمال.',
  ['غداء الاجتماعات وقاعات الإدارة', 'تموين المؤتمرات والندوات', 'إطلاق المنتجات وضيافة العملاء', 'احتفالات الموظفين واللقاءات العامة'],
  ['توضيح الصيغة والحضور والتوقيت', 'مراجعة أسلوب القائمة وصيغة الخدمة والوصول إلى المكان', 'تأكيد الخطة وطلب عرض سعر مخصص'],
  [('هل يمكن ترتيب التموين للاجتماعات المتكررة؟', 'نعم، تُناقش الترتيبات المتكررة أثناء التخطيط، بما فيها القوائم والكميات وجداول التوصيل.', True), ('هل توفرون فريق خدمة لفعاليات الأعمال؟', 'تُتفق خيارات الخدمة لكل فعالية حسب الصيغة والمكان.', True)]),
 ('government-official', 'المناسبات الملكية والحكومية', 'ضيافة مدروسة للمناسبات الرسمية والمؤسسية والقائمة على البروتوكول.', 'الوزارات والجهات العامة والمضيفون الدبلوماسيون ومنسقو المناسبات الرسمية.',
  ['حفلات الاستقبال الرسمية والمراسم', 'العشاءات البروتوكولية والوفود المستضافة', 'المؤتمرات ومنتديات القطاع العام', 'المناسبات الوطنية والمؤسسية'],
  ['فهم البروتوكول والبرنامج وطبيعة الضيوف', 'مواءمة القائمة وتسلسل الخدمة والتجهيز مع المنظمين', 'تأكيد الخدمات اللوجستية وطلب عرض سعر مخصص'],
  [('كم من الوقت مسبقًا يجب التخطيط للمناسبات الرسمية؟', 'في أقرب وقت ممكن، فالمناسبات الرسمية تحتاج وقتًا لمواءمة البروتوكول والموافقات والخدمات اللوجستية.', True), ('هل تنسقون مع فريق البروتوكول لدينا؟', 'نعم، تتم مواءمة تسلسل الخدمة والتوقيتات والتقديم مع منظميكم قبل المناسبة.', False)]),
 ('healthcare', 'المستشفيات والعيادات', 'حوارات تموين عملية لفرق الرعاية الصحية والاجتماعات والمناسبات المؤسسية.', 'المستشفيات والعيادات والمكاتب الطبية ومنسقو فعاليات الرعاية الصحية.',
  ['تموين اجتماعات الموظفين والإدارة', 'الندوات والفعاليات الصحية', 'ترتيبات وجبات مكان العمل المخطط لها', 'صيغ تقديم مرنة حسب الاستفسار'],
  ['توضيح نوع الموقع والغرض وعدد الوجبات', 'مراجعة التوقيت والتفضيلات الغذائية ومتطلبات التوصيل', 'تأكيد الإمكانية وطلب عرض سعر مخصص'],
  [('هل تشمل هذه الخدمة الحميات السريرية أو الموصوفة للمرضى؟', 'يجب الاتفاق على المواصفات السريرية والغذائية للقوائم مع فريق المنشأة قبل بدء أي خدمة.', True), ('هل يمكن مناقشة ترتيبات متكررة؟', 'نعم، تُخطط برامج الوجبات المتكررة مع فريقكم حسب الجداول ونقاط الخدمة.', True)]),
 ('industrial-sites', 'المواقع الصناعية والنائية', 'وجبات مخططة حول جداول العمل الصعبة ومتطلبات المواقع.', 'المقاولون والمشغلون الصناعيون ومخيمات المشاريع ومديرو المواقع.',
  ['برامج وجبات يومية للعاملين', 'توقيت الوجبات حسب الورديات', 'وجبات معبأة للفرق المتنقلة', 'تموين مراحل التجهيز والمشاريع'],
  ['توضيح الموقع وعدد العاملين ونمط الورديات', 'مراجعة الوصول للتوصيل والتوقيت ونموذج الخدمة', 'تأكيد التغطية وطلب عرض سعر مخصص'],
  [('هل تخدمون مواقع خارج الرياض؟', 'تُؤكَّد التغطية لكل موقع. اذكر الموقع في استفسارك.', True), ('هل يمكن أن تتغير الكميات أسبوعيًا؟', 'تُناقش تغيرات عدد العاملين ضمن الترتيب المتكرر.', True)]),
 ('education', 'المدارس والجامعات', 'تخطيط خدمات الطعام للفعاليات التعليمية والمجتمعات المؤسسية.', 'المدارس والجامعات ومعاهد التدريب وفرق فعاليات الحرم الجامعي.',
  ['ترتيبات الوجبات اليومية في الحرم', 'حفلات التخرج والأيام المفتوحة', 'اجتماعات الهيئة التدريسية والمؤتمرات الأكاديمية', 'فعاليات الطلاب وأيام الأنشطة'],
  ['فهم المؤسسة والتقويم والأعداد', 'مراجعة قوائم تناسب الجمهور والمكان', 'تأكيد التوقيت وطلب عرض سعر مخصص'],
  [('هل يمكن تكييف القوائم للطلاب الأصغر سنًا؟', 'تُقترح القوائم لاعتمادكم ويمكن تكييفها حسب الجمهور.', False), ('هل تقدمون برامج لفصل دراسي كامل؟', 'تُناقش البرامج المتكررة مع إدارتكم حسب التقويم الأكاديمي.', True)]),
 ('meal-boxes', 'علب الوجبات', 'صيغ وجبات فردية مقسّمة لأيام العمل والمناسبات المنظمة.', 'الفرق ومنظمو التدريب والزيارات الميدانية والفعاليات التي تحتاج وجبات معبأة فرديًا.',
  ['علب غداء للاجتماعات وأيام التدريب', 'علب إفطار للبدايات المبكرة', 'وجبات فعاليات معبأة فرديًا', 'برامج علب أسبوعية متكررة'],
  ['توضيح الكميات والتوقيت ونقطة التوصيل', 'مراجعة محتويات العلبة وأي تفضيلات', 'تأكيد الجدول وطلب عرض سعر مخصص'],
  [('هل يوجد حد أدنى لطلب علب الوجبات؟', 'اذكر الكمية المتوقعة في استفسارك وسينصحك الفريق.', True), ('هل يمكن وضع ملصق باسم كل ضيف؟', 'تُناقش خيارات الملصقات والتقديم أثناء التخطيط.', True)]),
 ('corporate-ramadan', 'تموين رمضان للشركات', 'ضيافة الإفطار والسحور للجهات والفرق.', 'الجهات التي تستضيف إفطار الموظفين وسحور العملاء وتجمعات رمضان.',
  ['تجمعات إفطار الموظفين', 'إفطارات مستضافة للعملاء والشركاء', 'خدمة السحور لفرق الورديات الليلية', 'علب وجبات رمضانية وتوزيعات'],
  ['توضيح التاريخ والأعداد والمكان مبكرًا', 'مراجعة القائمة وأسلوب الخدمة للتجمع', 'تأكيد التوقيت حول الإفطار وطلب عرض سعر مخصص'],
  [('كم مبكرًا يجب حجز تموين رمضان؟', 'رمضان موسم ذروة، وننصح بشدة بالتخطيط المبكر.', True), ('هل يمكنكم تقديم الإفطار في مكاتبنا؟', 'نعم، يُؤكَّد الوصول إلى المكان والتجهيز أثناء التخطيط.', False)]),
]
CEL_AR = [
 ('weddings-engagements', 'حفلات الزفاف والخطوبة', 'قوائم احتفالية وضيافة مبنية حول مناسبة ذات معنى.', 'العرسان والعائلات ومنظمو حفلات الزفاف الذين يحضّرون للخطوبة والزفاف.',
  ['عشاءات مقدَّمة وبوفيهات', 'استقبالات ترحيبية وخدمة كانابيه', 'طاولات حلويات', 'طعام أواخر السهرة وما بعد الحفل'],
  ['فهم البرنامج والضيوف والمكان', 'صياغة القائمة والتقديم وأسلوب الخدمة', 'تأكيد الجدول الزمني وطلب عرض سعر مخصص'],
  [('متى يجب أن نحجز لحفل الزفاف؟', 'تستفيد حفلات الزفاف وتواريخ المواسم المزدحمة من التخطيط المبكر. شاركنا التاريخ في أقرب وقت.', True), ('هل يمكن أن تعكس القائمة تقاليد العائلة؟', 'نعم، تُقترح القوائم حول ضيوفك وتقاليدك وتُعدَّل قبل التأكيد.', False)]),
 ('private-occasions', 'المناسبات الخاصة', 'قوائم مدروسة للحظات العائلية والتجمعات والاحتفالات.', 'العائلات والمضيفون الذين يحتفلون بأعياد الميلاد والتخرج والتجمعات والاستقبالات المنزلية.',
  ['التجمعات العائلية والاستقبالات المنزلية', 'أعياد الميلاد وحفلات التخرج', 'عشاءات حميمة', 'الاحتفالات الموسمية والأعياد'],
  ['فهم المناسبة والأعداد والمكان', 'مراجعة خيارات القائمة وأسلوب الخدمة', 'تأكيد التفاصيل وطلب عرض سعر مخصص'],
  [('هل تخدمون التجمعات الخاصة الصغيرة؟', 'اذكر العدد المتوقع للضيوف وسينصحك الفريق بالخيارات المناسبة.', True), ('هل توصلون وتجهزون في المنزل؟', 'تُتفق خيارات التجهيز والخدمة لكل مناسبة.', True)]),
 ('ramadan-events', 'إفطار وسحور رمضان', 'موائد رمضانية مرحّبة للتجمعات الخاصة والمناسبات المستضافة.', 'العائلات والمضيفون الذين يخططون لإفطار وسحور الأقارب والأصدقاء والضيوف.',
  ['موائد إفطار عائلية', 'أمسيات سحور مستضافة', 'ضيافة المجالس الرمضانية', 'إفطارات مجتمعية أكبر'],
  ['توضيح التاريخ والضيوف والمكان مبكرًا', 'صياغة قائمة الإفطار أو السحور', 'تأكيد التوقيتات حول الإفطار وطلب عرض سعر مخصص'],
  [('كم مسبقًا يجب حجز تجمعات رمضان؟', 'رمضان موسم مزدحم، وننصح بالتخطيط المبكر.', True), ('هل تقدمون أطباقًا رمضانية تقليدية؟', 'تُقترح القوائم حول تفضيلاتك وتُؤكَّد قبل المناسبة.', True)]),
 ('vip-luxury', 'الضيافة الفاخرة لكبار الضيوف', 'تقديم طعام راقٍ ومدروس للمناسبات المستضافة الاستثنائية.', 'مضيفو الضيوف المميزين والعشاءات الخاصة والمناسبات رفيعة المستوى.',
  ['قوائم مقدَّمة بأسلوب الطعام الراقي', 'خدمة منتبهة وهادئة', 'تقديم وتنسيق راقٍ', 'تجارب بقيادة الطهاة'],
  ['فهم الضيوف والمكان والتوقعات', 'تصميم القائمة والتقديم وتسلسل الخدمة', 'تأكيد كل التفاصيل وطلب عرض سعر مخصص'],
  [('هل يمكن أن تكون القوائم مخصصة بالكامل؟', 'نعم، تُصمم قوائم كبار الضيوف حول المناسبة وتُؤكَّد معك.', False), ('هل تتوفر خدمة هادئة ومتحفظة؟', 'يُخطط أسلوب الخدمة، بما في ذلك الخصوصية والتوقيت، معك.', True)]),
 ('live-stations', 'محطات الطهي المباشر', 'تجارب طعام تُحضَّر طازجة وتصبح جزءًا من المناسبة.', 'الفعاليات التي يستمتع فيها الضيوف بمحطات يشرف عليها الطهاة كجزء من التجربة.',
  ['محطات طهي يشرف عليها الطهاة', 'محطات الشواء والتقطيع', 'محطات الحلويات والمعجنات', 'محطات تفاعلية بطابع خاص'],
  ['فهم المكان والمساحة وحركة الضيوف', 'اختيار المحطات والقوائم للمناسبة', 'تأكيد احتياجات التجهيز وطلب عرض سعر مخصص'],
  [('ماذا تحتاج محطة الطهي المباشر من المكان؟', 'تُؤكَّد المساحة والوصول واحتياجات التجهيز أثناء التخطيط.', True), ('هل يمكن دمج المحطات مع بوفيه؟', 'نعم، يمكن دمج صيغ الخدمة حسب برنامجك.', False)]),
 ('canapes-receptions', 'الكانابيه والاستقبالات', 'لقيمات أنيقة وخدمة عملية للضيوف المتنقلين.', 'الاستقبالات والافتتاحات والفعاليات الوقوفية والتجمعات الترحيبية.',
  ['كانابيه يقدمه فريق الخدمة', 'منصات عرض منسّقة', 'مشروبات ومرطبات الاستقبال', 'تجمعات ترحيبية قصيرة'],
  ['فهم الصيغة والمدة والأعداد', 'اختيار قوائم الكانابيه والتقديم', 'تأكيد خطة الخدمة وطلب عرض سعر مخصص'],
  [('كم قطعة كانابيه لكل ضيف؟', 'تُقترح الكميات حسب صيغة الاستقبال ومدته.', True), ('هل يمكن تقديم الكانابيه بواسطة فريق الخدمة؟', 'تُتفق خيارات الخدمة لكل فعالية.', True)]),
]
def apply_services(d, key, rows):
    items = d['pages'][key]['services']['items']
    assert len(items) == len(rows), (key, len(items), len(rows))
    for it, (slug, title, short, who, opts, plan, faq) in zip(items, rows):
        it.update({'slug': slug, 'title': title, 'short': short, 'who': who, 'options': opts, 'plan': plan, 'faq': [{'q': q, 'a': a, 'review': r} for q, a, r in faq]})
apply_services(EN, 'corporates', CORP_EN); apply_services(EN, 'celebrations', CEL_EN)
apply_services(AR, 'corporates', CORP_AR); apply_services(AR, 'celebrations', CEL_AR)
for d, L in ((EN, 'en'), (AR, 'ar')):
    d['pages']['corporates']['hero'].update({'num': '01', 'eyebrow': 'What we do' if L == 'en' else 'ماذا نقدم', 'panelLabel': 'Corporate' if L == 'en' else 'الشركات',
        'lead': 'Catering for meetings, institutions and working teams — planned around the day, the guest and the practical detail.' if L == 'en' else 'تموين للاجتماعات والمؤسسات وفرق العمل — مخطط حول اليوم والضيف والتفاصيل العملية.'})
    d['pages']['celebrations']['hero'].update({'num': '02', 'eyebrow': 'Celebrate with Plum' if L == 'en' else 'احتفل مع بلام', 'panelLabel': 'Celebrations' if L == 'en' else 'المناسبات',
        'lead': 'Menus and hospitality designed around the moments people gather to celebrate.' if L == 'en' else 'قوائم وضيافة مصممة حول اللحظات التي يجتمع الناس للاحتفال بها.'})
    d['pages']['corporates']['hero']['h2overview'] = d['pages']['corporates']['overview']['h2']
    d['pages']['celebrations']['hero']['h2overview'] = d['pages']['celebrations']['overview']['h2']

# ---------------------------------------------------------------- B2B hub v2 + families
EN['pages']['b2b'].update({
  'hero': {**EN['pages']['b2b']['hero'], 'num': '03', 'eyebrow': 'For hospitality businesses', 'panelLabel': 'B2B supply',
           'lead': 'Explore a structured range of bakery and dessert products for hotels, restaurants, cafés and other hospitality buyers. Browse by family and discuss your sourcing requirements with the team.'},
  'stats': {'products': 'Catalogue products', 'families': 'Product families', 'trade': 'Trade', 'tradeLabel': 'Quote-based supply enquiries', 'pdf': 'PDF', 'pdfLabel': 'Official product catalogue'},
  'families': {'eyebrow': 'Product catalogue', 'h2': 'Explore Our Product Range', 'intro': 'See the full category range. Individual product information is organized for browsing; the site is not designed as an e-commerce checkout.', 'options': '{n} product options'},
  'finder': {'eyebrow': 'Quick product finder', 'h2': 'Find a product by name', 'label': 'Search all 76 catalogue items', 'placeholder': 'Type a product name, e.g. sourdough', 'showing': 'Showing {n} of {total} products', 'all': 'All {total} products'},
  'trade': {'eyebrow': 'For trade buyers', 'h2': 'B2B Supply for Foodservice Businesses', 'h3': 'Tell us what your business needs', 'body': 'Let the team know what type of business you run, which product families interest you, your estimated volumes and delivery location. This helps focus the next conversation.',
            'list': ['Hotels and hospitality groups', 'Restaurants and food-service operators', 'Cafés, bakeries and dessert outlets', 'Purchasing and procurement teams']},
  'catalogueCard': {'eyebrow': 'Catalogue access', 'h3': 'Product details, in one place', 'body': 'Use the official Plum catalogue for current product specifications. Every product also has its own page on this site.'},
  'processB2B': {'eyebrow': 'B2B process', 'h2': 'How to enquire about supply', 'steps': [
      {'h3': 'Select your products', 'body': 'Identify the categories or specific product names relevant to your business.'},
      {'h3': 'Share your requirements', 'body': 'Include business type, city, estimated quantity and how often you may need delivery.'},
      {'h3': 'Discuss the proposal', 'body': 'Review actual formats, availability and commercial terms directly with the Plum team.'}]},
  'faq': {**EN['pages']['b2b']['faq'], 'eyebrow': 'Buyer guide'},
  'finalCta': {**EN['pages']['b2b']['finalCta'], 'eyebrow': 'Let’s talk', 'h2alt': 'Start a supply conversation', 'body': 'Tell us your product families, estimated quantities and business location.'},
})
AR['pages']['b2b'].update({
  'hero': {**AR['pages']['b2b']['hero'], 'num': '03', 'eyebrow': 'لمنشآت قطاع الضيافة', 'panelLabel': 'توريد الأعمال',
           'lead': 'استكشف مجموعة منظمة من المخبوزات والحلويات للفنادق والمطاعم والمقاهي وغيرها من مشتري قطاع الضيافة. تصفّح حسب الفئة وناقش احتياجات التوريد مع الفريق.'},
  'stats': {'products': 'منتجًا في الكتالوج', 'families': 'فئات منتجات', 'trade': 'تجاري', 'tradeLabel': 'توريد بناءً على عرض سعر', 'pdf': 'PDF', 'pdfLabel': 'كتالوج المنتجات الرسمي'},
  'families': {'eyebrow': 'كتالوج المنتجات', 'h2': 'استكشف مجموعة منتجاتنا', 'intro': 'اطّلع على كل الفئات. معلومات المنتجات منظمة للتصفح، والموقع ليس متجرًا إلكترونيًا.', 'options': '{n} منتجًا'},
  'finder': {'eyebrow': 'باحث المنتجات السريع', 'h2': 'ابحث عن منتج بالاسم', 'label': 'ابحث في جميع منتجات الكتالوج الـ76', 'placeholder': 'اكتب اسم المنتج، مثل: ساوردو', 'showing': 'عرض {n} من {total} منتجًا', 'all': 'كل المنتجات ({total})'},
  'trade': {'eyebrow': 'لمشتري القطاع التجاري', 'h2': 'حلول توريد المنتجات لقطاع الأعمال', 'h3': 'أخبرنا بما تحتاجه منشأتك', 'body': 'أخبر الفريق بنوع منشأتك وفئات المنتجات التي تهمك وحجم الكميات التقديري وموقع التوصيل. يساعد ذلك على تركيز الحوار التالي.',
            'list': ['الفنادق ومجموعات الضيافة', 'المطاعم ومشغلو خدمات الطعام', 'المقاهي والمخابز ومحلات الحلويات', 'فرق المشتريات والتوريد']},
  'catalogueCard': {'eyebrow': 'الوصول إلى الكتالوج', 'h3': 'تفاصيل المنتجات في مكان واحد', 'body': 'استخدم كتالوج بلام الرسمي لمواصفات المنتجات الحالية. ولكل منتج أيضًا صفحة خاصة على هذا الموقع.'},
  'processB2B': {'eyebrow': 'مراحل التوريد', 'h2': 'كيف تستفسر عن التوريد', 'steps': [
      {'h3': 'اختر منتجاتك', 'body': 'حدد الفئات أو أسماء المنتجات المناسبة لمنشأتك.'},
      {'h3': 'شاركنا متطلباتك', 'body': 'اذكر نوع المنشأة والمدينة والكمية التقديرية ووتيرة التوصيل المطلوبة.'},
      {'h3': 'ناقش العرض', 'body': 'راجع الصيغ الفعلية والتوفر والشروط التجارية مباشرة مع فريق بلام.'}]},
  'faq': {**AR['pages']['b2b']['faq'], 'eyebrow': 'دليل المشتري'},
  'finalCta': {**AR['pages']['b2b']['finalCta'], 'eyebrow': 'لنتحدث', 'h2alt': 'ابدأ حوار التوريد', 'body': 'أخبرنا بفئات المنتجات والكميات التقديرية وموقع منشأتك.'},
})
EN['pages']['familyBlurbs'] = {'bread': 'Sourdough, baguettes, rolls and buns for professional kitchens.', 'croissants': 'Classic and filled croissant options for hospitality and café service.', 'danish-focaccia': 'Savory focaccia, Danish pastries and Pain Suisse selections.', 'eclairs': 'A varied éclair selection for displays, dessert menus and events.', 'miracle-cakes': 'Individual premium cake selections for hospitality menus.', 'molded-cakes': 'Portioned cakes and desserts for plated service and counters.', 'whole-cakes': 'Full-size cakes for hospitality displays and shared occasions.'}
AR['pages']['familyBlurbs'] = {'bread': 'ساوردو وباغيت ورولات وخبز برغر للمطابخ الاحترافية.', 'croissants': 'خيارات كرواسون كلاسيكية ومحشوة لخدمات الضيافة والمقاهي.', 'danish-focaccia': 'فوكاتشيا مالحة ومعجنات دانيش وتشكيلة بان سويس.', 'eclairs': 'تشكيلة متنوعة من الإكلير للعرض وقوائم الحلويات والفعاليات.', 'miracle-cakes': 'كيك فردي فاخر لقوائم الضيافة.', 'molded-cakes': 'كيك وحلويات مقسّمة للتقديم في الأطباق والعرض على الطاولات.', 'whole-cakes': 'كيك كامل الحجم لعروض الضيافة والمناسبات المشتركة.'}
EN['pages']['family'] = {'eyebrow': 'B2B · Product family', 'h1': '{family} for Wholesale Supply', 'lead': '{blurb} Browse the product range and share your sourcing requirements with Plum’s B2B team.', 'metaTitle': 'Wholesale {family} Supplier Riyadh | Plum B2B', 'metaDesc': '{blurb} {n} {family} products from Plum Catering’s central kitchen in Riyadh, supplied to hotels, restaurants and cafés. Request a quote.',
  'statsRange': 'Product range', 'statsProducts': 'Products', 'statsFresh': 'Fresh shelf life', 'statsFrozen': 'Baked-frozen', 'collectionEyebrow': 'Products', 'collectionH2': 'The {family} collection', 'collectionIntro': '{n} named items from Plum’s published catalogue. Current pack details, availability and commercial terms are confirmed with the sales team.',
  'othersEyebrow': 'More from the catalogue', 'othersH2': 'Browse other product families', 'ctaH2': 'Interested in {family} supply?', 'ctaBody': 'Start with your business location, quantities and preferred items.', 'notOffered': 'Not offered'}
AR['pages']['family'] = {'eyebrow': 'قطاع الأعمال · فئة منتجات', 'h1': '{family} للتوريد بالجملة', 'lead': '{blurb} تصفّح مجموعة المنتجات وشارك احتياجات التوريد مع فريق بلام لقطاع الأعمال.', 'metaTitle': 'مورد {family} بالجملة في الرياض | بلام لقطاع الأعمال', 'metaDesc': '{blurb} {n} منتجًا من فئة {family} من مطبخ بلام للتموين المركزي في الرياض، للفنادق والمطاعم والمقاهي. اطلب عرض سعر.',
  'statsRange': 'مجموعة المنتجات', 'statsProducts': 'منتجًا', 'statsFresh': 'الصلاحية طازجًا', 'statsFrozen': 'مخبوز مجمد', 'collectionEyebrow': 'المنتجات', 'collectionH2': 'مجموعة {family}', 'collectionIntro': '{n} منتجًا مسمّى من كتالوج بلام المنشور. تُؤكَّد تفاصيل التغليف الحالية والتوفر والشروط التجارية مع فريق المبيعات.',
  'othersEyebrow': 'المزيد من الكتالوج', 'othersH2': 'تصفّح فئات المنتجات الأخرى', 'ctaH2': 'مهتم بتوريد {family}؟', 'ctaBody': 'ابدأ بموقع منشأتك والكميات والأصناف المفضلة.', 'notOffered': 'غير متاح'}

# ---------------------------------------------------------------- Gallery, Contact
EN['pages']['gallery'] = {'meta': {'title': 'Plum at Work — Gallery | Plum Catering', 'description': 'A gallery of Plum Catering at work in Riyadh: events, kitchen preparation, food and bakery, and service moments.'},
  'hero': {'eyebrow': 'Selected work', 'h1': 'Plum at Work', 'lead': 'The moments behind each catering project: food, people, kitchen preparation and event setups.', 'panelLabel': 'Gallery'},
  'collections': {'eyebrow': 'Media collections', 'h2': 'Explore the story behind the service'}, 'note': 'Final media library: client-approved images and film, organized by collection. Placeholders are shown until assets are supplied.',
  'cta': {'eyebrow': 'Let’s talk', 'h2': 'Inspired by what you see?', 'body': 'Tell us about the occasion you are planning.'}}
AR['pages']['gallery'] = {'meta': {'title': 'بلام في العمل — المعرض | بلام للتموين', 'description': 'معرض أعمال بلام للتموين في الرياض: الفعاليات والتحضير في المطبخ والطعام والمخبوزات ولحظات الخدمة.'},
  'hero': {'eyebrow': 'أعمال مختارة', 'h1': 'بلام في العمل', 'lead': 'اللحظات التي تقف وراء كل مشروع تموين: الطعام والناس والتحضير في المطبخ وتجهيزات الفعاليات.', 'panelLabel': 'المعرض'},
  'collections': {'eyebrow': 'مجموعات الوسائط', 'h2': 'اكتشف القصة وراء الخدمة'}, 'note': 'مكتبة الوسائط النهائية: صور وأفلام معتمدة من العميل، منظمة حسب المجموعة. تُعرض صور مؤقتة حتى توريد الأصول.',
  'cta': {'eyebrow': 'لنتحدث', 'h2': 'هل ألهمك ما رأيت؟', 'body': 'أخبرنا عن المناسبة التي تخطط لها.'}}
EN['pages']['contact'] = {'meta': {'title': 'Contact & Quotations | Plum Catering', 'description': 'Contact Plum Catering in Riyadh for event quotations, B2B bakery supply enquiries, phone and WhatsApp.'},
  'hero': {'eyebrow': 'Start a conversation', 'h1': 'Contact & Quotations', 'lead': 'Choose the type of enquiry that fits your plans. Share your event or trade requirements and the right team will follow up.', 'panelLabel': 'Contact'},
  'channels': {'eyebrow': 'Contact channels', 'h2': 'How would you like to get in touch', 'items': [
      {'num': '01', 'label': 'Catering', 'h3': 'Event quotation', 'body': 'Share date, guest count, city and preferred catering format.', 'cta': 'Open catering enquiry', 'service': 'celebration'},
      {'num': '02', 'label': 'Trade', 'h3': 'B2B supply enquiry', 'body': 'Share your product interests, volume, business type and location.', 'cta': 'Open B2B enquiry', 'service': 'b2b'},
      {'num': '03', 'label': 'Direct', 'h3': 'Phone or WhatsApp', 'body': 'For questions, use the contact number currently published by Plum.'}]},
  'brief': {'eyebrow': 'How to enquire', 'h2': 'A clear brief makes a better proposal', 'lead': 'A useful enquiry tells the team what matters without making the visitor fill in an endless form.',
            'items': ['Your name and contact information', 'Business or event type', 'City, date and expected size', 'Menu or product interests', 'Anything else the team should know']},
  'base': {'label': 'Base location', 'h3': 'Riyadh, Saudi Arabia', 'body': 'For events or supply enquiries in other Saudi cities, share the destination so service coverage and logistics can be confirmed.', 'note': 'No online booking, checkout or payment gateway.'}}
AR['pages']['contact'] = {'meta': {'title': 'تواصل معنا وطلب عرض سعر | بلام للتموين', 'description': 'تواصل مع بلام للتموين في الرياض لطلب عروض أسعار المناسبات واستفسارات توريد المخبوزات لقطاع الأعمال، عبر الهاتف وواتساب.'},
  'hero': {'eyebrow': 'ابدأ الحوار', 'h1': 'تواصل معنا وطلب عرض سعر', 'lead': 'اختر نوع الاستفسار المناسب لخططك. شاركنا متطلبات مناسبتك أو التوريد وسيتابع معك الفريق المختص.', 'panelLabel': 'التواصل'},
  'channels': {'eyebrow': 'قنوات التواصل', 'h2': 'كيف تفضّل التواصل معنا؟', 'items': [
      {'num': '01', 'label': 'التموين', 'h3': 'عرض سعر لمناسبة', 'body': 'شاركنا التاريخ وعدد الضيوف والمدينة وأسلوب التموين المفضل.', 'cta': 'افتح استفسار التموين', 'service': 'celebration'},
      {'num': '02', 'label': 'تجاري', 'h3': 'استفسار توريد للأعمال', 'body': 'شاركنا المنتجات التي تهمك والكميات ونوع المنشأة والموقع.', 'cta': 'افتح استفسار قطاع الأعمال', 'service': 'b2b'},
      {'num': '03', 'label': 'مباشر', 'h3': 'الهاتف أو واتساب', 'body': 'للاستفسارات، استخدم رقم التواصل المنشور حاليًا من بلام.'}]},
  'brief': {'eyebrow': 'كيف تستفسر', 'h2': 'الطلب الواضح يصنع عرضًا أفضل', 'lead': 'الاستفسار المفيد يخبر الفريق بما يهم دون إجبار الزائر على ملء نموذج لا ينتهي.',
            'items': ['اسمك وبيانات التواصل', 'نوع المنشأة أو المناسبة', 'المدينة والتاريخ والحجم المتوقع', 'القائمة أو المنتجات التي تهمك', 'أي شيء آخر يجب أن يعرفه الفريق']},
  'base': {'label': 'الموقع الرئيسي', 'h3': 'الرياض، المملكة العربية السعودية', 'body': 'للمناسبات أو طلبات التوريد في مدن أخرى بالمملكة، اذكر الوجهة لتأكيد التغطية والخدمات اللوجستية.', 'note': 'لا يوجد حجز إلكتروني أو سلة شراء أو بوابة دفع.'}}

# ---------------------------------------------------------------- About v2, Facility v2
EN['pages']['about'].update({
  'hero': {**EN['pages']['about']['hero'], 'eyebrow': 'Our story', 'lead': 'Good hospitality begins well before food reaches the table. Discover the kitchen, people-first approach and planning behind the Plum experience.', 'panelLabel': 'About'},
  'business': {'eyebrow': 'Our business', 'h2alt': 'A practical approach to memorable hospitality', 'body2': 'The business spans corporate and institutional catering, celebrations and events, and B2B bakery and pastry supply. Each area has different requirements, but all benefit from thoughtful food preparation and clear coordination.',
               'listLabel': 'Our business', 'list': ['Corporate & institutional catering', 'Celebrations and events', 'B2B bakery and pastry supply']},
  'kitchenV2': {'eyebrow': 'Our kitchen', 'h3': 'Prepared with intention', 'list': ['Kitchen and food preparation', 'Menu planning and coordination', 'Transport and service arrangements', 'Standards and food safety'], 'factsLabel': 'Kitchen facts', 'areaLabel': 'Published kitchen area', 'certLabel': 'Listed food-safety certification'},
  'film': {'eyebrow': 'Behind the scenes', 'h2': 'A view of the preparation process', 'h3': 'From preparation to presentation', 'body': 'An approved kitchen film introduces the production process, with a lightweight poster and click-to-play behaviour.'},
  'audiences': {'eyebrow': 'Audiences', 'h2': 'The people we work with', 'items': ['Corporate offices and teams', 'Government organizations', 'Healthcare and education', 'Industrial sites and projects', 'Families and private hosts', 'Wedding and event coordinators', 'Hotels and restaurants', 'Cafés and hospitality buyers']},
  'process': {**EN['pages']['about']['process'], 'eyebrow': 'Our method'},
  'finalCta': {**EN['pages']['about']['finalCta'], 'eyebrow': 'Let’s talk', 'h2alt': 'Get to know what Plum can do for you', 'body': 'Choose your service and tell the team what you need.'},
})
AR['pages']['about'].update({
  'hero': {**AR['pages']['about']['hero'], 'eyebrow': 'قصتنا', 'lead': 'تبدأ الضيافة الجيدة قبل وصول الطعام إلى المائدة بكثير. اكتشف المطبخ والنهج الذي يضع الإنسان أولًا والتخطيط الذي يقف وراء تجربة بلام.', 'panelLabel': 'من نحن'},
  'business': {'eyebrow': 'أعمالنا', 'h2alt': 'نهج عملي لضيافة لا تُنسى', 'body2': 'تشمل أعمالنا تموين الشركات والمؤسسات، والحفلات والمناسبات، وتوريد المخبوزات والمعجنات لقطاع الأعمال. لكل مجال متطلباته، لكنها جميعًا تستفيد من تحضير مدروس للطعام وتنسيق واضح.',
               'listLabel': 'أعمالنا', 'list': ['تموين الشركات والمؤسسات', 'الحفلات والمناسبات', 'توريد المخبوزات والمعجنات لقطاع الأعمال']},
  'kitchenV2': {'eyebrow': 'مطبخنا', 'h3': 'تحضير بعناية', 'list': ['المطبخ وتحضير الطعام', 'تخطيط القوائم والتنسيق', 'النقل وترتيبات الخدمة', 'المعايير وسلامة الغذاء'], 'factsLabel': 'حقائق عن المطبخ', 'areaLabel': 'مساحة المطبخ المنشورة', 'certLabel': 'شهادة سلامة الغذاء المذكورة'},
  'film': {'eyebrow': 'خلف الكواليس', 'h2': 'نظرة على عملية التحضير', 'h3': 'من التحضير إلى التقديم', 'body': 'يعرّف فيلم المطبخ المعتمد بعملية الإنتاج، مع ملصق خفيف وتشغيل عند النقر.'},
  'audiences': {'eyebrow': 'الجمهور', 'h2': 'من نعمل معهم', 'items': ['مكاتب الشركات وفرقها', 'الجهات الحكومية', 'الرعاية الصحية والتعليم', 'المواقع الصناعية والمشاريع', 'العائلات والمضيفون', 'منسقو حفلات الزفاف والفعاليات', 'الفنادق والمطاعم', 'المقاهي ومشترو قطاع الضيافة']},
  'process': {**AR['pages']['about']['process'], 'eyebrow': 'أسلوبنا'},
  'finalCta': {**AR['pages']['about']['finalCta'], 'eyebrow': 'لنتحدث', 'h2alt': 'تعرّف على ما يمكن أن تقدمه بلام لك', 'body': 'اختر خدمتك وأخبر الفريق بما تحتاجه.'},
})
EN['pages']['facility']['comingSoon'].update({'num': '04', 'eyebrow': 'Future offering', 'panelLabel': 'Coming soon', 'plannedEyebrow': 'Services in preparation', 'badge': 'In preparation', 'plannedBody': 'Planned offering. Details and availability will be published when the service formally launches.',
  'info': {'eyebrow': 'Important information', 'h2': 'A separate business line — not open yet', 'body1': 'This page shows the future direction of the website without suggesting an active service or inviting orders that cannot yet be fulfilled.', 'body2': 'Once a service is confirmed, each category will be expanded with a meaningful description, operational coverage and its own enquiry path.', 'statusLabel': 'Current status', 'status': 'Coming soon', 'statusBody': 'For current catering or B2B requirements, please explore the active services.'},
  'liveEyebrow': 'Available now'})
AR['pages']['facility']['comingSoon'].update({'num': '04', 'eyebrow': 'خدمة مستقبلية', 'panelLabel': 'قريبًا', 'plannedEyebrow': 'خدمات قيد الإعداد', 'badge': 'قيد الإعداد', 'plannedBody': 'خدمة مخطط لها. ستُنشر التفاصيل والتوفر عند الإطلاق الرسمي للخدمة.',
  'info': {'eyebrow': 'معلومات مهمة', 'h2': 'مجال أعمال منفصل — لم يُفتح بعد', 'body1': 'تعرض هذه الصفحة الاتجاه المستقبلي للموقع دون الإيحاء بخدمة قائمة أو دعوة لطلبات لا يمكن تنفيذها بعد.', 'body2': 'عند تأكيد الخدمة، ستُوسَّع كل فئة بوصف واضح ونطاق تشغيلي ومسار استفسار خاص بها.', 'statusLabel': 'الحالة الحالية', 'status': 'قريبًا', 'statusBody': 'لاحتياجات التموين أو قطاع الأعمال الحالية، يرجى استكشاف الخدمات القائمة.'},
  'liveEyebrow': 'متاح الآن'})
EN['pages']['privacy']['hero'] = {'eyebrow': 'Website information', 'panelLabel': 'Privacy'}; AR['pages']['privacy']['hero'] = {'eyebrow': 'معلومات الموقع', 'panelLabel': 'الخصوصية'}
EN['pages']['product']['familyLink'] = 'See the {family} range'; AR['pages']['product']['familyLink'] = 'عرض مجموعة {family}'

save('en', EN); save('ar', AR)
print('content v2 patched')
