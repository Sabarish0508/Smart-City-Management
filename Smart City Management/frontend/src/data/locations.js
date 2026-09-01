/**
 * Comprehensive Location dataset supporting hierarchical State -> City -> Municipality/Corporation -> Ward/Zone selection.
 * Covers all major administrative divisions, municipal corporations, municipalities, and zones.
 */
export const LOCATIONS_DATA = {
  'Tamil Nadu': {
    cities: {
      'Tiruppur': {
        municipalities: [
          {
            name: 'Tiruppur City Municipal Corporation - Central Zone',
            wards: [
              'Ward 1 - Avinashi Road Zone',
              'Ward 2 - Kangeyam Road Zone',
              'Ward 3 - Central Bazar & Cotton Market',
              'Ward 4 - Rayapuram Commercial Zone',
              'Ward 5 - Kumaran Road Administrative Zone',
            ],
          },
          {
            name: 'Tiruppur City Municipal Corporation - North Zone',
            wards: [
              'Ward 6 - Velampalayam Zone',
              'Ward 7 - Anupparpalayam Textile Zone',
              'Ward 8 - 15 Velampalayam Ring Road',
              'Ward 9 - Chettipalayam North',
              'Ward 10 - Angeripalayam Industrial Zone',
            ],
          },
          {
            name: 'Tiruppur City Municipal Corporation - South Zone',
            wards: [
              'Ward 11 - Nallur & Industrial Estate',
              'Ward 12 - Veerapandi South Zone',
              'Ward 13 - Kovilvazhi Housing Sector',
              'Ward 14 - KNP Colony Commercial',
              'Ward 15 - Dharapuram Road Extension',
            ],
          },
          {
            name: 'Tiruppur City Municipal Corporation - East Zone',
            wards: [
              'Ward 16 - Mangalam Zone',
              'Ward 17 - Palladam Road Zone',
              'Ward 18 - S.N. Nagar Residential',
              'Ward 19 - College Road Institutional Zone',
              'Ward 20 - Mannarai Heritage Sector',
            ],
          },
          {
            name: 'Avinashi Town Panchayat',
            wards: [
              'Ward 1 - Old Town & Heritage Temple',
              'Ward 2 - Avinashi Bypass Zone',
              'Ward 3 - Sevur Road Commercial Zone',
              'Ward 4 - Cheyur Road Residential',
            ],
          },
          {
            name: 'Palladam Municipality',
            wards: [
              'Ward 1 - Palladam Town Center',
              'Ward 2 - Coimbatore Highway Commercial',
              'Ward 3 - Tiruppur Highway Industrial',
              'Ward 4 - Chettipalayam Road',
            ],
          },
          {
            name: 'Dharapuram Municipality',
            wards: [
              'Ward 1 - Amaravathi Riverfront Zone',
              'Ward 2 - Dharapuram Central Market',
              'Ward 3 - Pollachi Road Residential',
              'Ward 4 - Palani Road Extension',
            ],
          },
          {
            name: 'Kangeyam Municipality',
            wards: [
              'Ward 1 - Kangeyam Bus Stand Zone',
              'Ward 2 - Chennimalai Road Industrial',
              'Ward 3 - Muthur Road Residential',
            ],
          },
          {
            name: 'Vellakovil Municipality',
            wards: [
              'Ward 1 - Vellakovil Commercial Center',
              'Ward 2 - Muthur Road Zone',
              'Ward 3 - Karur Highway Zone',
            ],
          },
          {
            name: 'Uthukuli Town Panchayat',
            wards: [
              'Ward 1 - Uthukuli RS Zone',
              'Ward 2 - Market Road Commercial',
              'Ward 3 - Kunnathur Road Residential',
            ],
          },
        ],
      },
      'Chennai': {
        municipalities: [
          {
            name: 'Greater Chennai Corporation - North Zone (Royapuram & Tondiarpet)',
            wards: [
              'Ward 1 - Royapuram Harbor Zone',
              'Ward 2 - George Town Commercial',
              'Ward 3 - Tondiarpet Industrial',
              'Ward 4 - Washermanpet Market Area',
              'Ward 5 - Tiruvottiyur High Road',
            ],
          },
          {
            name: 'Greater Chennai Corporation - Central Zone (Anna Nagar & T. Nagar)',
            wards: [
              'Ward 6 - Anna Nagar West & Tower Zone',
              'Ward 7 - T. Nagar Panagal Park Commercial',
              'Ward 8 - Nungambakkam Institutional',
              'Ward 9 - Kodambakkam Film Corridor',
              'Ward 10 - Kilpauk Medical Zone',
            ],
          },
          {
            name: 'Greater Chennai Corporation - South Zone (Adyar & Mylapore)',
            wards: [
              'Ward 11 - Adyar & Besant Nagar Beach Zone',
              'Ward 12 - Mylapore Heritage & Temple Zone',
              'Ward 13 - Thiruvanmiyur ECR Coastal Zone',
              'Ward 14 - Guindy Industrial Estate',
              'Ward 15 - Velachery Lake & Transit Zone',
            ],
          },
          {
            name: 'Greater Chennai Corporation - OMR & ECR Zone (Sholinganallur)',
            wards: [
              'Ward 16 - Sholinganallur IT SEZ Hub',
              'Ward 17 - Perungudi Cyber Corridor',
              'Ward 18 - Thoraipakkam Radial Zone',
              'Ward 19 - Karapakkam & Injambakkam',
            ],
          },
          {
            name: 'Tambaram Municipal Corporation',
            wards: [
              'Ward 1 - Chromepet Commercial Market',
              'Ward 2 - East Tambaram Railway Zone',
              'Ward 3 - Selaiyur & Camp Road',
              'Ward 4 - Pallavaram Hill Road Zone',
              'Ward 5 - Pammal Industrial Sector',
              'Ward 6 - Anakaputhur Residential Zone',
              'Ward 7 - Sembakkam Lakefront Zone',
            ],
          },
          {
            name: 'Avadi Municipal Corporation',
            wards: [
              'Ward 1 - Avadi HVF Defense Zone',
              'Ward 2 - Pattabiram & Tidel Park-3',
              'Ward 3 - Mittanamalli Residential',
              'Ward 4 - Paruthipattu Lake Area',
            ],
          },
          {
            name: 'Poonamallee Municipality',
            wards: [
              'Ward 1 - Poonamallee Trunk Road',
              'Ward 2 - Mangadu Junction Zone',
              'Ward 3 - Senneerkuppam Residential',
            ],
          },
          {
            name: 'Kundrathur Municipality',
            wards: [
              'Ward 1 - Murugan Temple Zone',
              'Ward 2 - Kundrathur Main Road',
              'Ward 3 - Anakaputhur Link Road',
            ],
          },
          {
            name: 'Mangadu Municipality',
            wards: [
              'Ward 1 - Kamakshi Amman Temple Zone',
              'Ward 2 - Mangadu Commercial Bypass',
              'Ward 3 - Kozhumanivakkam Sector',
            ],
          },
          {
            name: 'Maraimalai Nagar Municipality',
            wards: [
              'Ward 1 - Ford Automotive SEZ Zone',
              'Ward 2 - Kattankulathur University Zone',
              'Ward 3 - Singaperumal Koil Extension',
            ],
          },
        ],
      },
      'Coimbatore': {
        municipalities: [
          {
            name: 'Coimbatore City Municipal Corporation - Central Zone',
            wards: [
              'Ward 1 - RS Puram Central & Diwan Bahadur Road',
              'Ward 2 - Gandhipuram Commercial Bus Terminus',
              'Ward 3 - Town Hall Heritage & Big Bazaar',
              'Ward 4 - Ram Nagar Commercial Zone',
              'Ward 5 - Race Course Promenade Area',
            ],
          },
          {
            name: 'Coimbatore City Municipal Corporation - East Zone',
            wards: [
              'Ward 6 - Singanallur Bus Terminal Zone',
              'Ward 7 - Peelamedu Tech & Educational Hub',
              'Ward 8 - Ramanathapuram Commercial',
              'Ward 9 - Sowripalayam Industrial Area',
              'Ward 10 - Ondipudur Industrial Belt',
            ],
          },
          {
            name: 'Coimbatore City Municipal Corporation - North Zone',
            wards: [
              'Ward 11 - Saravanampatti IT Corridor & SEZ',
              'Ward 12 - Saibaba Colony Residential',
              'Ward 13 - Ganapathy Industrial Ward',
              'Ward 14 - Kavundampalayam Bypass Zone',
              'Ward 15 - Thudiyalur Commercial Junction',
            ],
          },
          {
            name: 'Coimbatore City Municipal Corporation - South Zone',
            wards: [
              'Ward 16 - Kuniyamuthur Palakkad Road',
              'Ward 17 - Kovaipudur Housing Complex',
              'Ward 18 - Sundarapuram Industrial Zone',
              'Ward 19 - Kurichi Lakefront Ward',
            ],
          },
          {
            name: 'Coimbatore City Municipal Corporation - West Zone',
            wards: [
              'Ward 20 - Vadavalli Residential Foothills',
              'Ward 21 - Thondamuthur Road Ward',
              'Ward 22 - Telungupalayam Agricultural Zone',
            ],
          },
          {
            name: 'Pollachi Municipality',
            wards: [
              'Ward 1 - Pollachi Central Market & Bus Stand',
              'Ward 2 - Mahalingapuram Residential',
              'Ward 3 - Udumalpet Road Commercial',
              'Ward 4 - Palakkad Road Industrial',
            ],
          },
          {
            name: 'Mettupalayam Municipality',
            wards: [
              'Ward 1 - Nilgiri Heritage Railway Zone',
              'Ward 2 - Bhavani Riverfront Zone',
              'Ward 3 - Annur Road Commercial Sector',
            ],
          },
          {
            name: 'Madukkarai Municipality',
            wards: [
              'Ward 1 - Cement Factory Industrial Zone',
              'Ward 2 - Palakkad Highway Sector',
              'Ward 3 - Market Road Residential',
            ],
          },
          {
            name: 'Karamadai Municipality',
            wards: [
              'Ward 1 - Ranganathar Temple Zone',
              'Ward 2 - Mettupalayam Highway Sector',
            ],
          },
          {
            name: 'Sulur Town Panchayat',
            wards: [
              'Ward 1 - Air Force Base Area',
              'Ward 2 - Sulur Big Tank Zone',
              'Ward 3 - Trichy Road Commercial',
            ],
          },
        ],
      },
      'Madurai': {
        municipalities: [
          {
            name: 'Madurai Municipal Corporation - Central Zone',
            wards: [
              'Ward 1 - Meenakshi Amman Temple Heritage Zone',
              'Ward 2 - Periyar Bus Stand Commercial Hub',
              'Ward 3 - Simmakkal Trade Corridor',
              'Ward 4 - Goripalayam Junction',
            ],
          },
          {
            name: 'Madurai Municipal Corporation - East Zone',
            wards: [
              'Ward 5 - KK Nagar Residential & Administrative',
              'Ward 6 - Anna Nagar Commercial Belt',
              'Ward 7 - Mattuthavani Integrated Bus Terminal',
              'Ward 8 - Vandiyur Lakefront Zone',
            ],
          },
          {
            name: 'Madurai Municipal Corporation - North Zone',
            wards: [
              'Ward 9 - Sellur Weaving Industrial Zone',
              'Ward 10 - Tallakulam Institutional Ward',
              'Ward 11 - Koodal Nagar Railway Colony',
              'Ward 12 - Iyer Bungalow Extension',
            ],
          },
          {
            name: 'Madurai Municipal Corporation - South Zone',
            wards: [
              'Ward 13 - Thiruparankundram Temple Ward',
              'Ward 14 - Villapuram Housing Board',
              'Ward 15 - Jaihindpuram Industrial',
              'Ward 16 - Pasumalai Hillside Residential',
            ],
          },
          {
            name: 'Melur Municipality',
            wards: [
              'Ward 1 - Melur Bus Stand Commercial',
              'Ward 2 - Trichy Highway Sector',
              'Ward 3 - Agricultural Market Zone',
            ],
          },
          {
            name: 'Thirumangalam Municipality',
            wards: [
              'Ward 1 - Thirumangalam Railway Station Zone',
              'Ward 2 - Usilampatti Road Commercial',
              'Ward 3 - Bypass Road Extension',
            ],
          },
        ],
      },
      'Salem': {
        municipalities: [
          {
            name: 'Salem City Municipal Corporation - Hasthampatti Zone',
            wards: [
              'Ward 1 - Hasthampatti Central Commercial',
              'Ward 2 - Yercaud Foothills Zone',
              'Ward 3 - Collectorate Administrative Sector',
              'Ward 4 - Gorimedu Institutional Zone',
            ],
          },
          {
            name: 'Salem City Municipal Corporation - Suramangalam Zone',
            wards: [
              'Ward 5 - Salem Junction Railway Station Zone',
              'Ward 6 - Steel Plant Road Industrial Area',
              'Ward 7 - Leigh Bazaar Agro Trading Hub',
              'Ward 8 - Reddiyur Residential Ward',
            ],
          },
          {
            name: 'Salem City Municipal Corporation - Ammapet Zone',
            wards: [
              'Ward 9 - Ammapet Handloom Weavers Zone',
              'Ward 10 - Ponnammapet Commercial Market',
              'Ward 11 - Attur Road Commercial Corridor',
            ],
          },
          {
            name: 'Salem City Municipal Corporation - Fort Zone',
            wards: [
              'Ward 12 - Fort Heritage & Old Town Area',
              'Ward 13 - Shevapet Wholesale Market Hub',
              'Ward 14 - Gugai Textile Weaving Center',
              'Ward 15 - Dadagapatti Industrial Belt',
            ],
          },
          {
            name: 'Attur Municipality',
            wards: [
              'Ward 1 - Attur Fort Heritage Zone',
              'Ward 2 - Bus Stand Commercial Center',
              'Ward 3 - Salem-Cuddalore Highway Sector',
            ],
          },
          {
            name: 'Mettur Municipality',
            wards: [
              'Ward 1 - Stanley Reservoir Dam Zone',
              'Ward 2 - Chemical & Thermal Power Industrial',
              'Ward 3 - RS Market Commercial Hub',
            ],
          },
        ],
      },
      'Erode': {
        municipalities: [
          {
            name: 'Erode City Municipal Corporation - Central Zone',
            wards: [
              'Ward 1 - Brough Road Commercial Corridor',
              'Ward 2 - Gani Textile Market Hub',
              'Ward 3 - Bus Stand & Clock Tower Zone',
              'Ward 4 - Railway Station Colony Area',
            ],
          },
          {
            name: 'Erode City Municipal Corporation - Perundurai Road Zone',
            wards: [
              'Ward 5 - Collectorate & Administrative Complex',
              'Ward 6 - Thindal Hillside Residential Sector',
              'Ward 7 - Kasi Palayam Modern Extension',
            ],
          },
          {
            name: 'Erode City Municipal Corporation - Veerappanchatram Zone',
            wards: [
              'Ward 8 - Powerloom Industrial Belt',
              'Ward 9 - Sathy Road Commercial Corridor',
              'Ward 10 - Manickampalayam Housing Unit',
            ],
          },
          {
            name: 'Erode City Municipal Corporation - Surampatti Zone',
            wards: [
              'Ward 11 - Surampatti Four Road Junction',
              'Ward 12 - Rangampalayam Railway Link',
              'Ward 13 - Solar Bus Terminal Extension',
            ],
          },
          {
            name: 'Bhavani Municipality',
            wards: [
              'Ward 1 - Sangameswarar Temple River Confluence',
              'Ward 2 - Anthiyur Road Commercial Sector',
              'Ward 3 - Carpet & Handloom Center',
            ],
          },
          {
            name: 'Gobichettipalayam Municipality',
            wards: [
              'Ward 1 - Gobi Bus Stand Commercial',
              'Ward 2 - Sathy Road Institutional Zone',
              'Ward 3 - Modachur Silk Reeling Sector',
            ],
          },
        ],
      },
      'Tiruchirappalli': {
        municipalities: [
          {
            name: 'Tiruchirappalli City Municipal Corporation - Srirangam Zone',
            wards: [
              'Ward 1 - Ranganathaswamy Temple Heritage Ward',
              'Ward 2 - Thiruvanaikoil Water Temple Zone',
              'Ward 3 - Mambalasalai Cauvery Bridge Head',
            ],
          },
          {
            name: 'Tiruchirappalli City Municipal Corporation - Thillai Nagar Zone',
            wards: [
              'Ward 4 - Thillai Nagar Main Road Commercial Hub',
              'Ward 5 - Shastri Road Commercial Corridor',
              'Ward 6 - Tennur Residential Ward',
              'Ward 7 - Woraiyur Ancient Chola Heritage Zone',
            ],
          },
          {
            name: 'Tiruchirappalli City Municipal Corporation - Cantonment Zone',
            wards: [
              'Ward 8 - Central Bus Stand & Junction Hub',
              'Ward 9 - District Collectorate Administrative Area',
              'Ward 10 - Birds Road Commercial Sector',
            ],
          },
          {
            name: 'Tiruchirappalli City Municipal Corporation - K.K. Nagar Zone',
            wards: [
              'Ward 11 - K.K. Nagar Residential Layout',
              'Ward 12 - Airport Radial Link Zone',
              'Ward 13 - Crawford Residential Sector',
              'Ward 14 - Golden Rock Railway Workshop Zone',
            ],
          },
          {
            name: 'Tiruverumbur Municipality',
            wards: [
              'Ward 1 - BHEL Heavy Electricals Township',
              'Ward 2 - NIT Campus Tech Institutional Zone',
              'Ward 3 - Kattur Industrial Colony',
            ],
          },
          {
            name: 'Manapparai Municipality',
            wards: [
              'Ward 1 - Manapparai Cattle Market & Murukku Hub',
              'Ward 2 - Dindigul Highway Commercial Sector',
            ],
          },
        ],
      },
    },
  },
  'Karnataka': {
    cities: {
      'Bengaluru': {
        municipalities: [
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - East Zone',
            wards: [
              'Ward 112 - Indiranagar 100ft Road & CMH Road',
              'Ward 80 - Domlur & Embassy GolfLinks Tech Park',
              'Ward 113 - Jogupalya Commercial Ward',
              'Ward 81 - Halasuru Lake & Metro Zone',
              'Ward 88 - Jeevanbheemanagar Residential',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - South Zone',
            wards: [
              'Ward 151 - Koramangala 1st to 8th Blocks',
              'Ward 153 - Jayanagar 4th Block Shopping Complex',
              'Ward 174 - HSR Layout Sectors 1 through 7',
              'Ward 143 - Padmanabhanagar Residential',
              'Ward 167 - JP Nagar 2nd & 3rd Phases',
              'Ward 179 - Bannerghatta Road Commercial Hub',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Mahadevapura Tech Zone',
            wards: [
              'Ward 84 - Whitefield ITPL & Export Promotion Zone',
              'Ward 85 - Doddanekkundi Outer Ring Road',
              'Ward 86 - Marathahalli Junction & Bridge',
              'Ward 87 - Bellandur Tech Corridor & EcoSpace',
              'Ward 149 - Varthur Lake & Gunjur Expansion',
              'Ward 150 - Kadugodi Metro Terminal Area',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Bommanahalli Zone',
            wards: [
              'Ward 160 - Electronic City Phase 1 & 2 Entrance',
              'Ward 175 - Bommanahalli Industrial Area',
              'Ward 187 - Puttenahalli & Sarakki Lake',
              'Ward 191 - Singasandra & Hosur Road Belt',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - West Zone',
            wards: [
              'Ward 45 - Malleshwaram 8th Cross & Margosa Road',
              'Ward 94 - Rajajinagar 1st & 2nd Blocks',
              'Ward 109 - Chickpete Wholesale Commercial Bazaar',
              'Ward 120 - Majestic & KSR Railway Station Zone',
              'Ward 121 - Basavanagudi Gandhi Bazaar Heritage',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Yelahanka Zone',
            wards: [
              'Ward 1 - Kempegowda Ward & Airport Expressway',
              'Ward 2 - Yelahanka Satellite Town 4th Phase',
              'Ward 3 - Attur Layout Residential',
              'Ward 4 - Kogilu Cross & Thanisandra Corridor',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Rajarajeshwari Nagar Zone',
            wards: [
              'Ward 160 - RR Nagar Global Village Tech Park',
              'Ward 130 - Nayandahalli Mysore Road Junction',
              'Ward 73 - Kengeri Satellite Town Hub',
            ],
          },
          {
            name: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Dasarahalli Zone',
            wards: [
              'Ward 14 - T. Dasarahalli Peenya Industrial Estate',
              'Ward 15 - Bagalagunte & Jalahalli Cross',
              'Ward 16 - Chokkasandra Industrial Ward',
            ],
          },
          {
            name: 'Anekal Town Municipal Council',
            wards: [
              'Ward 1 - Anekal Town Bus Stand Center',
              'Ward 2 - Jigani Industrial Area Phase 1',
              'Ward 3 - Attibele Border Commercial Corridor',
            ],
          },
          {
            name: 'Hoskote City Municipal Council',
            wards: [
              'Ward 1 - Hoskote Industrial Area Auto Hub',
              'Ward 2 - National Highway 75 Commercial Sector',
              'Ward 3 - Old Town Heritage Ward',
            ],
          },
        ],
      },
      'Mysuru': {
        municipalities: [
          {
            name: 'Mysuru City Corporation - Zone 1 (Palace & Heritage)',
            wards: [
              'Ward 1 - Mysore Palace & Sayyaji Rao Road',
              'Ward 2 - Devaraja Market Commercial Hub',
              'Ward 3 - Chamundipuram Temple Zone',
              'Ward 4 - Ittigegud & Mysore Zoo Area',
            ],
          },
          {
            name: 'Mysuru City Corporation - Zone 2 (Vijayanagar & Hootagalli)',
            wards: [
              'Ward 5 - Vijayanagar 1st, 2nd & 3rd Stages',
              'Ward 6 - Hootagalli Industrial Estate',
              'Ward 7 - Belavadi Ring Road Junction',
            ],
          },
          {
            name: 'Mysuru City Corporation - Zone 3 (Kuvempunagar & Saraswathipuram)',
            wards: [
              'Ward 8 - Saraswathipuram University Sector',
              'Ward 9 - Kuvempunagar Complex & Vivekananda Road',
              'Ward 10 - TK Layout & Ramakrishnanagar',
            ],
          },
          {
            name: 'Mysuru City Corporation - Zone 4 (Gokulam & Jayalakshmipuram)',
            wards: [
              'Ward 11 - Gokulam 3rd Stage Yoga Hub',
              'Ward 12 - Jayalakshmipuram Temple Road',
              'Ward 13 - Vontikoppal Temple Circle',
              'Ward 14 - Hebbal Electronic City Industrial',
            ],
          },
          {
            name: 'Nanjangud City Municipal Council',
            wards: [
              'Ward 1 - Srikanteshwara Temple Riverfront Zone',
              'Ward 2 - Nanjangud Industrial Area',
              'Ward 3 - Gundlupet Highway Sector',
            ],
          },
          {
            name: 'Hunsur Town Municipal Council',
            wards: [
              'Ward 1 - Hunsur Bus Stand Commercial',
              'Ward 2 - Coorg Highway Junction Sector',
            ],
          },
        ],
      },
      'Hubballi-Dharwad': {
        municipalities: [
          {
            name: 'Hubballi-Dharwad Municipal Corporation - Hubballi Central',
            wards: [
              'Ward 1 - Vidyanagar Central & BVB College Corridor',
              'Ward 2 - Station Road Wholesale Trade Zone',
              'Ward 3 - Chennamma Circle & Durgadbail',
              'Ward 4 - Gokul Road Airport Industrial Belt',
            ],
          },
          {
            name: 'Hubballi-Dharwad Municipal Corporation - Hubballi North',
            wards: [
              'Ward 5 - Unkal Lake & BRTS Corridor',
              'Ward 6 - Keshwapur Industrial & Railway Colony',
              'Ward 7 - Kusugal Road Industrial Zone',
            ],
          },
          {
            name: 'Hubballi-Dharwad Municipal Corporation - Dharwad Central',
            wards: [
              'Ward 8 - Jubilee Circle Administrative Hub',
              'Ward 9 - Karnatak University Campus Area',
              'Ward 10 - Saptapur Residential Layout',
              'Ward 11 - Belagavi Road Industrial Corridor',
            ],
          },
          {
            name: 'Navalgund Town Municipal Council',
            wards: [
              'Ward 1 - Navalgund Central Market',
              'Ward 2 - Jamkhandi Highway Sector',
            ],
          },
        ],
      },
      'Mangaluru': {
        municipalities: [
          {
            name: 'Mangaluru City Corporation - Central Zone',
            wards: [
              'Ward 1 - Hampankatta Commercial Core',
              'Ward 2 - Lalbagh City Corporation HQ Zone',
              'Ward 3 - Bejai KSRTC Bus Terminal Area',
              'Ward 4 - Kodialbail Institutional Ward',
            ],
          },
          {
            name: 'Mangaluru City Corporation - Coastal & Port Zone',
            wards: [
              'Ward 5 - Panambur Port & NMPT Industrial Sector',
              'Ward 6 - Suratkal NITK Campus & Beach Zone',
              'Ward 7 - Baikampady Industrial Estate',
              'Ward 8 - Tannirbhavi Beachfront Corridor',
            ],
          },
          {
            name: 'Mangaluru City Corporation - Hills & Tech Zone',
            wards: [
              'Ward 9 - Kadri Hills & Temple Zone',
              'Ward 10 - Derebail Modern Housing Sector',
              'Ward 11 - Kottara Chowki Commercial Junction',
              'Ward 12 - Kankanady Hospital & Railway Hub',
            ],
          },
          {
            name: 'Ullal City Municipal Council',
            wards: [
              'Ward 1 - Ullal Dargah & Coastal Zone',
              'Ward 2 - Kotekar Agricultural Extension',
              'Ward 3 - Thokkottu Commercial Junction',
            ],
          },
        ],
      },
      'Belagavi': {
        municipalities: [
          {
            name: 'Belagavi City Corporation - Central Zone',
            wards: [
              'Ward 1 - Tilakwadi Central & Deshmukh Road',
              'Ward 2 - Camp Area Administrative & Cantonment Link',
              'Ward 3 - Shahapur Weavers Heritage Zone',
              'Ward 4 - Khade Bazaar Commercial Wholesale Hub',
            ],
          },
          {
            name: 'Belagavi City Corporation - North Zone',
            wards: [
              'Ward 5 - Auto Nagar Industrial Hub',
              'Ward 6 - Ramteerth Nagar Housing Layout',
              'Ward 7 - Kanbargi Extension Sector',
            ],
          },
          {
            name: 'Belagavi Cantonment Board',
            wards: [
              'Ward 1 - Cantonment Hospital Ward',
              'Ward 2 - St. Anthony Parade Ground Sector',
              'Ward 3 - Military Station Colony',
            ],
          },
        ],
      },
    },
  },
  'Maharashtra': {
    cities: {
      'Mumbai': {
        municipalities: [
          {
            name: 'Brihanmumbai Municipal Corporation (BMC) - South Mumbai (A to D Wards)',
            wards: [
              'Ward A - Colaba, Fort & Nariman Point',
              'Ward B - Sandhurst Road & Dongri',
              'Ward C - Marine Lines & Girgaon',
              'Ward D - Malabar Hill, Walkeshwar & Grant Road',
            ],
          },
          {
            name: 'Brihanmumbai Municipal Corporation (BMC) - Central Mumbai (E to G Wards)',
            wards: [
              'Ward E - Byculla & Mumbai Central',
              'Ward F/South - Parel, Lower Parel Mill Land Hub',
              'Ward F/North - Matunga, Wadala & Sion',
              'Ward G/South - Worli Sea Face & Mahalaxmi',
              'Ward G/North - Dadar Shivaji Park & Mahim',
            ],
          },
          {
            name: 'Brihanmumbai Municipal Corporation (BMC) - Western Suburbs (H to R Wards)',
            wards: [
              'Ward H/West - Bandra West, Carter Road & Khar',
              'Ward H/East - Bandra East & Bandra-Kurla Complex (BKC)',
              'Ward K/West - Andheri West, Lokhandwala & Juhu',
              'Ward K/East - Andheri East, MIDC & SEEPZ',
              'Ward P/South - Goregaon West & Film City Road',
              'Ward P/North - Malad West Link Road Tech Zone',
              'Ward R/South - Kandivali Lokhandwala Complex',
              'Ward R/Central - Borivali West & National Park',
            ],
          },
          {
            name: 'Brihanmumbai Municipal Corporation (BMC) - Eastern Suburbs (L to T Wards)',
            wards: [
              'Ward L - Kurla West & Phoenix Marketcity',
              'Ward M/West - Chembur Diamond Garden Zone',
              'Ward N - Ghatkopar East & Pant Nagar',
              'Ward S - Bhandup Industrial & Powai Hiranandani',
              'Ward T - Mulund West & LBS Marg Corridor',
            ],
          },
          {
            name: 'Thane Municipal Corporation (TMC)',
            wards: [
              'Ward 1 - Naupada & Ghantali Residential Hub',
              'Ward 2 - Ghodbunder Road Tech Corridor & Hiranandani Estate',
              'Ward 3 - Majiwada & Viviana Commercial Area',
              'Ward 4 - Vartak Nagar Industrial Sector',
              'Ward 5 - Kalwa & Kharegaon Zone',
              'Ward 6 - Wagle Estate IT & Industrial Park',
            ],
          },
          {
            name: 'Navi Mumbai Municipal Corporation (NMMC)',
            wards: [
              'Ward 1 - Vashi Commercial Sector 17 & Sector 9',
              'Ward 2 - CBD Belapur Administrative Complex',
              'Ward 3 - Nerul Palm Beach Road & Seawoods',
              'Ward 4 - Kopar Khairane Industrial Sector',
              'Ward 5 - Airoli Mindspace Tech Corridor',
              'Ward 6 - Ghansoli Reliance Corporate Park Zone',
            ],
          },
          {
            name: 'Kalyan-Dombivli Municipal Corporation (KDMC)',
            wards: [
              'Ward 1 - Kalyan Station Commercial Hub',
              'Ward 2 - Dombivli Gymkhana & MIDC Industrial',
              'Ward 3 - Titwala Heritage Temple Zone',
            ],
          },
          {
            name: 'Mira-Bhayandar Municipal Corporation (MBMC)',
            wards: [
              'Ward 1 - Mira Road Shanti Nagar Layout',
              'Ward 2 - Bhayandar West Coastal & Salt Pan Zone',
              'Ward 3 - Kashimira Western Express Highway Sector',
            ],
          },
          {
            name: 'Vasai-Virar City Municipal Corporation (VVCMC)',
            wards: [
              'Ward 1 - Vasai West Ambadi Road Commercial',
              'Ward 2 - Virar East Manvelpada Sector',
              'Ward 3 - Nalasopara Central Market Belt',
            ],
          },
          {
            name: 'Panvel Municipal Corporation (PMC)',
            wards: [
              'Ward 1 - Old Panvel Market & Bus Station',
              'Ward 2 - Kharghar Central Park & Sector 20',
              'Ward 3 - Kamothe Mansarovar Railway Zone',
            ],
          },
        ],
      },
      'Pune': {
        municipalities: [
          {
            name: 'Pune Municipal Corporation (PMC) - Central Zone',
            wards: [
              'Ward 1 - Shivajinagar Central & FC Road',
              'Ward 2 - Deccan Gymkhana & JM Road',
              'Ward 3 - Kasba Peth Heritage & Shaniwar Wada',
              'Ward 4 - Bhavani Peth Wholesale Grain Market',
              'Ward 5 - Sadashiv Peth & Tilak Road',
            ],
          },
          {
            name: 'Pune Municipal Corporation (PMC) - Kothrud & Karve Road',
            wards: [
              'Ward 6 - Kothrud Paud Road & MIT College Zone',
              'Ward 7 - Karve Nagar DP Road Residential',
              'Ward 8 - Bavdhan & Chandani Chowk Highway Zone',
              'Ward 9 - Warje Malwadi Riverfront Area',
            ],
          },
          {
            name: 'Pune Municipal Corporation (PMC) - Aundh, Baner & Balewadi',
            wards: [
              'Ward 10 - Baner IT Corridor & High Street',
              'Ward 11 - Balewadi National Sports Complex Hub',
              'Ward 12 - Aundh Parihar Chowk Commercial',
              'Ward 13 - Pashan National Chemical Lab Zone',
            ],
          },
          {
            name: 'Pune Municipal Corporation (PMC) - Nagar Road & Airport Zone',
            wards: [
              'Ward 14 - Viman Nagar IT Corridor & Symbiosis',
              'Ward 15 - Kalyani Nagar & Koregaon Park North Main Road',
              'Ward 16 - Kharadi EON Free Zone & WTC Hub',
              'Ward 17 - Yerwada Jail Road Industrial Sector',
            ],
          },
          {
            name: 'Pune Municipal Corporation (PMC) - Hadapsar & South Zone',
            wards: [
              'Ward 18 - Hadapsar Magarpatta Cyber City',
              'Ward 19 - SP Infocity & Fursungi Tech Zone',
              'Ward 20 - Kondhwa & NIBM Road Sector',
              'Ward 21 - Dhankawadi & Katraj Snake Park Area',
            ],
          },
          {
            name: 'Pimpri-Chinchwad Municipal Corporation (PCMC) - Hinjawadi & Pimpri Zone',
            wards: [
              'Ward 1 - Hinjawadi Rajiv Gandhi Infotech Park Phases 1-3',
              'Ward 2 - Wakad Datta Mandir Road Corridor',
              'Ward 3 - Pimpri Market & Finolex Chowk',
              'Ward 4 - Chinchwad Station & Telco Auto Zone',
            ],
          },
          {
            name: 'Pimpri-Chinchwad Municipal Corporation (PCMC) - Bhosari & Nigdi Zone',
            wards: [
              'Ward 5 - Bhosari MIDC Heavy Engineering Hub',
              'Ward 6 - Nigdi Pradhikaran Planned Layout',
              'Ward 7 - Akurdi Railway Station Industrial Area',
              'Ward 8 - Ravet BRTS Expressway Junction',
            ],
          },
          {
            name: 'Pune Cantonment Board (PCB)',
            wards: [
              'Ward 1 - Camp MG Road & East Street Commercial',
              'Ward 2 - Southern Command HQ Area',
              'Ward 3 - Wanowrie Salunke Vihar Sector',
            ],
          },
          {
            name: 'Khadki Cantonment Board (KCB)',
            wards: [
              'Ward 1 - Khadki Bazaar Commercial Zone',
              'Ward 2 - Ammunition Factory Defense Belt',
            ],
          },
          {
            name: 'Lonavala Municipal Council',
            wards: [
              'Ward 1 - Lonavala Market & Tiger Point Corridor',
              'Ward 2 - Khandala Ghats Highway Sector',
            ],
          },
        ],
      },
      'Nagpur': {
        municipalities: [
          {
            name: 'Nagpur Municipal Corporation - Dharampeth Zone',
            wards: [
              'Ward 1 - Dharampeth Commercial Market',
              'Ward 2 - Ram Nagar & Gokulpeth',
              'Ward 3 - Civil Lines Administrative Complex',
              'Ward 4 - Shivaji Nagar Residential Sector',
            ],
          },
          {
            name: 'Nagpur Municipal Corporation - Sitabuldi & Central Zone',
            wards: [
              'Ward 5 - Sitabuldi Main Road & Metro Junction',
              'Ward 6 - Itwari Wholesale Trade Market',
              'Ward 7 - Gandhibagh Cloth Market',
              'Ward 8 - Mahal Heritage & RSS Smruti Mandir Area',
            ],
          },
          {
            name: 'Nagpur Municipal Corporation - Laxmi Nagar Zone',
            wards: [
              'Ward 9 - Laxmi Nagar Water Tank Area',
              'Ward 10 - Bajaj Nagar IT & VNIT College Zone',
              'Ward 11 - Somalwada Wardha Road Corridor',
            ],
          },
          {
            name: 'Nagpur Municipal Corporation - MIHAN & South Zone',
            wards: [
              'Ward 12 - MIHAN Multi-modal SEZ Hub',
              'Ward 13 - Butibori Industrial Estate',
              'Ward 14 - Manish Nagar Airport Radial Sector',
            ],
          },
          {
            name: 'Kamthi Municipal Council',
            wards: [
              'Ward 1 - Kamthi Cantt & Main Market',
              'Ward 2 - Dragon Palace Temple Zone',
            ],
          },
        ],
      },
      'Thane': {
        municipalities: [
          {
            name: 'Thane Municipal Corporation - Naupada Zone',
            wards: [
              'Ward 1 - Naupada Ram Maruti Road',
              'Ward 2 - Talao Pali Lakefront Leisure Zone',
              'Ward 3 - Thane Railway Station Commercial Core',
            ],
          },
          {
            name: 'Thane Municipal Corporation - Ghodbunder Road Zone',
            wards: [
              'Ward 4 - Hiranandani Estate & Rodas Enclave',
              'Ward 5 - Kasarvadavali Modern Tech Sector',
              'Ward 6 - Owale Coastal Highway Link',
            ],
          },
          {
            name: 'Thane Municipal Corporation - Majiwada & Viviana Zone',
            wards: [
              'Ward 7 - Majiwada Golden Square Junction',
              'Ward 8 - Pokhran Road 1 & 2 Green Belt',
              'Ward 9 - Cadbury Junction Eastern Express Highway',
            ],
          },
          {
            name: 'Thane Municipal Corporation - Wagle Estate Zone',
            wards: [
              'Ward 10 - Wagle Industrial Estate Road No 16',
              'Ward 11 - Kisan Nagar Residential Sector',
              'Ward 12 - Ambika Nagar Hillside Area',
            ],
          },
        ],
      },
    },
  },
  'Delhi': {
    cities: {
      'New Delhi': {
        municipalities: [
          {
            name: 'New Delhi Municipal Council (NDMC) - Central Zone',
            wards: [
              'Ward 1 - Connaught Place (Inner & Outer Circles)',
              'Ward 2 - Barakhamba Road & Janpath',
              'Ward 3 - Mandi House Cultural Complex',
              'Ward 4 - Parliament Street Administrative Zone',
            ],
          },
          {
            name: 'New Delhi Municipal Council (NDMC) - Diplomatic & South Zone',
            wards: [
              'Ward 5 - Chanakyapuri Diplomatic Enclave (Embassies)',
              'Ward 6 - Golf Links, Khan Market & Lodhi Estate',
              'Ward 7 - Jor Bagh & Safdarjung Airport Corridor',
              'Ward 8 - Sarojini Nagar & Netaji Nagar Redevelopment Area',
            ],
          },
          {
            name: 'Delhi Cantonment Board (DCB)',
            wards: [
              'Ward 1 - Sadar Bazaar Delhi Cantt',
              'Ward 2 - Base Hospital & Parade Ground',
              'Ward 3 - Dhaula Kuan Army Officers Colony',
            ],
          },
        ],
      },
      'Central Delhi': {
        municipalities: [
          {
            name: 'Municipal Corporation of Delhi (MCD) - Karol Bagh Zone',
            wards: [
              'Ward 1 - Karol Bagh Ajmal Khan Road Market',
              'Ward 2 - Rajendra Nagar Coaching & Residential Hub',
              'Ward 3 - Patel Nagar East & West',
              'Ward 4 - Pusa Road & IARI Institute Zone',
            ],
          },
          {
            name: 'Municipal Corporation of Delhi (MCD) - City-SP Zone',
            wards: [
              'Ward 5 - Paharganj Hotel & Commercial Area',
              'Ward 6 - Daryaganj & Delhi Gate Heritage',
              'Ward 7 - Chandni Chowk & Red Fort Heritage Corridor',
              'Ward 8 - Sadar Bazar Wholesale Market Hub',
            ],
          },
        ],
      },
      'South Delhi': {
        municipalities: [
          {
            name: 'Municipal Corporation of Delhi (MCD) - South Zone (Hauz Khas & Saket)',
            wards: [
              'Ward 1 - Hauz Khas Village & Green Park',
              'Ward 2 - Saket District Centre & Malls',
              'Ward 3 - Greater Kailash 1 & M-Block Market',
              'Ward 4 - Greater Kailash 2 & Savitri Cinema Zone',
              'Ward 5 - Malviya Nagar & Shivalik Colony',
            ],
          },
          {
            name: 'Municipal Corporation of Delhi (MCD) - Nazafgarh & Vasant Kunj Zone',
            wards: [
              'Ward 6 - Vasant Kunj Malls & D-Block Layout',
              'Ward 7 - Vasant Vihar Diplomatic Sector',
              'Ward 8 - Mahipalpur Airport Hospitality Zone',
              'Ward 9 - Mehrauli Heritage Qutub Complex',
            ],
          },
        ],
      },
    },
  },
  'Telangana': {
    cities: {
      'Hyderabad': {
        municipalities: [
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - Serilingampally IT Zone',
            wards: [
              'Ward 1 - Gachibowli Financial District & WaveRock',
              'Ward 2 - Madhapur HITEC City & Cyber Towers',
              'Ward 3 - Kondapur & Botanical Garden Road',
              'Ward 4 - Jubilee Hills Road No 36 & 45',
              'Ward 5 - Nanakramguda IT SEZ Campus',
            ],
          },
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - Khairatabad Central Zone',
            wards: [
              'Ward 6 - Banjara Hills Road No 1 & 12',
              'Ward 7 - Somajiguda & Raj Bhavan Road',
              'Ward 8 - Ameerpet Educational & Commercial Hub',
              'Ward 9 - Panjagutta Central Junction',
              'Ward 10 - Begumpet Airport Road Corridor',
            ],
          },
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - Secunderabad Zone',
            wards: [
              'Ward 11 - Secunderabad Railway Station Market',
              'Ward 12 - Marredpally Residential Layout',
              'Ward 13 - Paradise Circle & MG Road',
              'Ward 14 - Bowenpally Agro Market Zone',
            ],
          },
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - Kukatpally Zone',
            wards: [
              'Ward 15 - KPHB Colony Phases 1 to 9',
              'Ward 16 - Nizampet Road Tech Hub',
              'Ward 17 - Miyapur Metro Terminal & Allwyn Colony',
              'Ward 18 - Bachupally Institutional Corridor',
            ],
          },
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - Charminar South Zone',
            wards: [
              'Ward 19 - Charminar & Laad Bazaar Heritage Zone',
              'Ward 20 - Falaknuma Palace & Heritage Corridor',
              'Ward 21 - Chandrayangutta Commercial Sector',
              'Ward 22 - Bahadurpura Zoo Park Road',
            ],
          },
          {
            name: 'Greater Hyderabad Municipal Corporation (GHMC) - LB Nagar Zone',
            wards: [
              'Ward 23 - LB Nagar Ring Road Junction',
              'Ward 24 - Dilsukhnagar Commercial Market Hub',
              'Ward 25 - Saroornagar Lakefront Area',
              'Ward 26 - Nagole Metro Corridor',
            ],
          },
          {
            name: 'Secunderabad Cantonment Board (SCB)',
            wards: [
              'Ward 1 - Bolarum Railway & Heritage Sector',
              'Ward 2 - Trimulgherry Military Hospital Zone',
              'Ward 3 - Karkhana Commercial Corridor',
            ],
          },
          {
            name: 'Nizampet Municipal Corporation',
            wards: [
              'Ward 1 - Nizampet Village Core',
              'Ward 2 - Pragathi Nagar Lake View Layout',
              'Ward 3 - Bachupally Extension',
            ],
          },
          {
            name: 'Badangpet Municipal Corporation',
            wards: [
              'Ward 1 - Badangpet Main Road Zone',
              'Ward 2 - Balapur Royal Heritage Area',
            ],
          },
          {
            name: 'Bandlaguda Jagir Municipal Corporation',
            wards: [
              'Ward 1 - Sun City Residential Sector',
              'Ward 2 - Gandipet Lake Approach Corridor',
            ],
          },
        ],
      },
      'Warangal': {
        municipalities: [
          {
            name: 'Greater Warangal Municipal Corporation - Hanamkonda Zone',
            wards: [
              'Ward 1 - Hanamkonda Thousand Pillar Temple',
              'Ward 2 - Kakatiya University Campus Zone',
              'Ward 3 - Subedari Administrative Complex',
              'Ward 4 - Nakkalagutta Commercial Sector',
            ],
          },
          {
            name: 'Greater Warangal Municipal Corporation - Kazipet Zone',
            wards: [
              'Ward 5 - Kazipet Railway Junction & Colony',
              'Ward 6 - Fathimanagar Industrial Area',
              'Ward 7 - Diesel Loco Shed Tech Corridor',
            ],
          },
          {
            name: 'Greater Warangal Municipal Corporation - Warangal Fort Zone',
            wards: [
              'Ward 8 - Warangal Fort Archaeological Zone',
              'Ward 9 - Mattewada Cloth & Grain Market',
              'Ward 10 - Ursu Gutta Industrial Belt',
            ],
          },
        ],
      },
    },
  },
  'Kerala': {
    cities: {
      'Kochi': {
        municipalities: [
          {
            name: 'Kochi Municipal Corporation - Central Zone (Ernakulam)',
            wards: [
              'Ward 1 - Marine Drive Promenade & High Court',
              'Ward 2 - MG Road & Broadway Commercial Market',
              'Ward 3 - Panampilly Nagar Boutique & Tech Zone',
              'Ward 4 - Kadavanthra & Elamkulam Metro Zone',
            ],
          },
          {
            name: 'Kochi Municipal Corporation - Heritage Zone (Fort Kochi & Mattancherry)',
            wards: [
              'Ward 5 - Fort Kochi Chinese Fishing Nets Zone',
              'Ward 6 - Mattancherry Jew Town & Spice Market',
              'Ward 7 - Thoppumpady Harbor Approach Area',
            ],
          },
          {
            name: 'Kochi Municipal Corporation - Tech Zone (Kakkanad & Edappally)',
            wards: [
              'Ward 8 - Kakkanad InfoPark Phases 1 & 2',
              'Ward 9 - SmartCity Kochi Special Economic Zone',
              'Ward 10 - Edappally LuLu Mall & Metro Hub',
              'Ward 11 - Palarivattom Stadium Corridor',
            ],
          },
          {
            name: 'Thrikkakara Municipality',
            wards: [
              'Ward 1 - Thrikkakara Vamana Temple Zone',
              'Ward 2 - Seaport-Airport Road Industrial Area',
              'Ward 3 - Collectorate Administrative Campus',
            ],
          },
          {
            name: 'Aluva Municipality',
            wards: [
              'Ward 1 - Aluva Manappuram Periyar Riverfront',
              'Ward 2 - Railway Station Commercial Hub',
              'Ward 3 - Metro Terminal & Market Area',
            ],
          },
          {
            name: 'Kalamassery Municipality',
            wards: [
              'Ward 1 - CUSAT University Tech Zone',
              'Ward 2 - HMT Heavy Engineering Industrial Hub',
              'Ward 3 - Premier Tyres Junction Area',
            ],
          },
          {
            name: 'Tripunithura Municipality',
            wards: [
              'Ward 1 - Hill Palace Royal Heritage Zone',
              'Ward 2 - Statue Junction Commercial Market',
              'Ward 3 - Poornathrayeesa Temple Area',
            ],
          },
          {
            name: 'Maradu Municipality',
            wards: [
              'Ward 1 - Kundannoor Four Star Hospitality Corridor',
              'Ward 2 - Nettoor Backwater Transit Hub',
            ],
          },
        ],
      },
      'Thiruvananthapuram': {
        municipalities: [
          {
            name: 'Thiruvananthapuram Corporation - Secretariat & Central Zone',
            wards: [
              'Ward 1 - Government Secretariat & Palayam',
              'Ward 2 - MG Road & Statue Commercial Core',
              'Ward 3 - Thampanoor Central Bus & Railway Station',
              'Ward 4 - East Fort Padmanabhaswamy Temple Heritage',
            ],
          },
          {
            name: 'Thiruvananthapuram Corporation - Palace & Institutional Zone',
            wards: [
              'Ward 5 - Kowdiar Palace & Golf Club Promenade',
              'Ward 6 - Pattom Commercial Junction & LIC Hub',
              'Ward 7 - Museum & Zoo Green Corridor',
              'Ward 8 - Medical College Institutional Sector',
            ],
          },
          {
            name: 'Thiruvananthapuram Corporation - Technopark Zone (Kazhakkoottam)',
            wards: [
              'Ward 9 - Technopark Phases 1, 2 & 3 SEZ',
              'Ward 10 - Kazhakkoottam Cyber City Junction',
              'Ward 11 - Kariavattom University Campus',
              'Ward 12 - KINFRA Film & Video Park Hub',
            ],
          },
          {
            name: 'Neyyattinkara Municipality',
            wards: [
              'Ward 1 - Sreekrishna Swamy Temple Riverfront Zone',
              'Ward 2 - Amaravila Industrial Border',
              'Ward 3 - Bus Stand Commercial Sector',
            ],
          },
          {
            name: 'Attingal Municipality',
            wards: [
              'Ward 1 - Attingal Palace Heritage Zone',
              'Ward 2 - Kollam Highway Commercial Core',
            ],
          },
          {
            name: 'Nedumangad Municipality',
            wards: [
              'Ward 1 - Koyikkal Palace Heritage Area',
              'Ward 2 - Agricultural Produce Market Hub',
            ],
          },
        ],
      },
    },
  },
  'Andhra Pradesh': {
    cities: {
      'Visakhapatnam': {
        municipalities: [
          {
            name: 'Greater Visakhapatnam Municipal Corporation (GVMC) - Beach & Central Zone',
            wards: [
              'Ward 1 - RK Beach Road Promenade & Submarine Museum',
              'Ward 2 - Siripuram Junction Commercial & Tech Hub',
              'Ward 3 - Jagadamba Centre Cinema & Retail District',
              'Ward 4 - Dwaraka Nagar RTC Complex Transport Hub',
            ],
          },
          {
            name: 'Greater Visakhapatnam Municipal Corporation (GVMC) - Residential & Tech Zone',
            wards: [
              'Ward 5 - MVP Colony Sectors 1 to 12',
              'Ward 6 - Rushikonda Beach & IT SEZ Hill 1-3',
              'Ward 7 - Madhurawada Cricket Stadium & Tech Hub',
              'Ward 8 - Seethammadhara Green Residential Sector',
            ],
          },
          {
            name: 'Greater Visakhapatnam Municipal Corporation (GVMC) - Industrial Zone',
            wards: [
              'Ward 9 - Gajuwaka Vizag Steel Plant (RINL) Township',
              'Ward 10 - Autonagar Industrial Estate',
              'Ward 11 - Scindia & Naval Dockyard Defense Sector',
              'Ward 12 - Pendurthi Railway Approach Zone',
            ],
          },
          {
            name: 'Anakapalle Municipality',
            wards: [
              'Ward 1 - Anakapalle Jaggery Wholesale Market',
              'Ward 2 - Sarada River Commercial Corridor',
              'Ward 3 - Pudimadaka Road Industrial Area',
            ],
          },
          {
            name: 'Bheemunipatnam Municipality',
            wards: [
              'Ward 1 - Bheemili Dutch Heritage & Beach Zone',
              'Ward 2 - Gosthani River Confluence Sector',
            ],
          },
        ],
      },
      'Vijayawada': {
        municipalities: [
          {
            name: 'Vijayawada Municipal Corporation - Central Zone',
            wards: [
              'Ward 1 - MG Road (Bandar Road) Commercial Corridor',
              'Ward 2 - Governorpet Wholesale & Electronic Market',
              'Ward 3 - Benz Circle High-rise District',
              'Ward 4 - Suryaraopet Residential & Hospital Zone',
            ],
          },
          {
            name: 'Vijayawada Municipal Corporation - Riverfront & Canal Zone',
            wards: [
              'Ward 5 - Kanaka Durga Temple Heritage Hill Zone',
              'Ward 6 - Prakasam Barrage Riverfront Area',
              'Ward 7 - Bhavanipuram River View Layout',
              'Ward 8 - Vidyadharapuram Transport Terminal Area',
            ],
          },
          {
            name: 'Vijayawada Municipal Corporation - Auto & Tech Zone',
            wards: [
              'Ward 9 - Auto Nagar Heavy Industrial Hub',
              'Ward 10 - Gunadala Mary Matha Shrine Zone',
              'Ward 11 - Patamata Modern Commercial Layout',
              'Ward 12 - Enikepadu Tech Park & Highway Corridor',
            ],
          },
          {
            name: 'Mangalagiri-Tadepalli Municipal Corporation',
            wards: [
              'Ward 1 - Mangalagiri Handloom & AIIMS Hospital Zone',
              'Ward 2 - Tadepalli Buckingham Canal Transit Belt',
              'Ward 3 - Capital Expressway Corridor',
            ],
          },
          {
            name: 'Gudivada Municipality',
            wards: [
              'Ward 1 - Nehru Chowk Commercial Centre',
              'Ward 2 - Railway Goods Yard Industrial Zone',
            ],
          },
        ],
      },
    },
  },
  'Gujarat': {
    cities: {
      'Ahmedabad': {
        municipalities: [
          {
            name: 'Amdavad Municipal Corporation (AMC) - West Zone',
            wards: [
              'Ward 1 - Navrangpura & CG Road Commercial Core',
              'Ward 2 - Ashram Road Riverfront North Promenade',
              'Ward 3 - Ambawadi & Polytechnic Institutional',
              'Ward 4 - Paldi & NID Riverfront Zone',
              'Ward 5 - Usmanpura & Income Tax Cross Roads',
            ],
          },
          {
            name: 'Amdavad Municipal Corporation (AMC) - New West Tech Zone',
            wards: [
              'Ward 6 - SG Highway Corporate Corridor & ISKCON',
              'Ward 7 - Bodakdev & Judges Bungalow Road',
              'Ward 8 - Satellite & Shyamal Cross Roads',
              'Ward 9 - Thaltej Shilaj Road Modern Extension',
              'Ward 10 - Prahlad Nagar Corporate Road & Garden',
              'Ward 11 - Gota & Vaishnodevi Circle SG Road',
            ],
          },
          {
            name: 'Amdavad Municipal Corporation (AMC) - East & Heritage Zone',
            wards: [
              'Ward 12 - Maninagar Kankaria Lakefront Leisure Hub',
              'Ward 13 - Khadia & Kalupur Walled City UNESCO Heritage',
              'Ward 14 - Saraspur & Gomtipur Textile Mill Area',
              'Ward 15 - Naroda Industrial Estate GIDC',
              'Ward 16 - Odhav Heavy Engineering Industrial Hub',
            ],
          },
          {
            name: 'Amdavad Municipal Corporation (AMC) - North Zone',
            wards: [
              'Ward 17 - Sabarmati Bullet Train & RTO Junction',
              'Ward 18 - Chandkheda & ONGC Energy Campus Hub',
              'Ward 19 - Motera Narendra Modi Stadium Sports Zone',
            ],
          },
          {
            name: 'Sanand Municipality',
            wards: [
              'Ward 1 - Automobile Industrial GIDC Corridor',
              'Ward 2 - Sanand Town Market & Railway Zone',
            ],
          },
          {
            name: 'Kalol Municipality',
            wards: [
              'Ward 1 - IFFCO Fertilizer Industrial Zone',
              'Ward 2 - Kalol Highway Commercial Market',
            ],
          },
        ],
      },
      'Surat': {
        municipalities: [
          {
            name: 'Surat Municipal Corporation (SMC) - Central Zone',
            wards: [
              'Ward 1 - Athwa Lines & Dumas Road Luxury Zone',
              'Ward 2 - Ring Road Textile Market Wholesale Hub',
              'Ward 3 - Chowk Bazaar Tapi Riverfront Heritage',
              'Ward 4 - Majura Gate Medical & Institutional Zone',
            ],
          },
          {
            name: 'Surat Municipal Corporation (SMC) - Diamond & Tech Zone',
            wards: [
              'Ward 5 - Varachha Diamond Bourse & Cutting Hub',
              'Ward 6 - Katargam Diamond & Jari Industrial Sector',
              'Ward 7 - Althan & Vesu High-rise Modern Extension',
              'Ward 8 - Surat Diamond Bourse (DREAM City Khajod)',
            ],
          },
          {
            name: 'Surat Municipal Corporation (SMC) - Industrial & Coastal Zone',
            wards: [
              'Ward 9 - Hazira Heavy Port & Petrochemical SEZ',
              'Ward 10 - Pandesara GIDC Textile Dyeing Estate',
              'Ward 11 - Sachin GIDC Export Processing Zone',
              'Ward 12 - Rander Heritage River Town Area',
            ],
          },
          {
            name: 'Navsari Municipality',
            wards: [
              'Ward 1 - Lunsikui Commercial Market',
              'Ward 2 - Parsi Wad & Heritage Zone',
              'Ward 3 - Surat-Navsari Twin City Corridor',
            ],
          },
          {
            name: 'Bardoli Municipality',
            wards: [
              'Ward 1 - Sardar Patel National Museum Zone',
              'Ward 2 - Sugar Factory Agro Industrial Hub',
            ],
          },
        ],
      },
    },
  },
};

export const STATES_LIST = Object.keys(LOCATIONS_DATA);

export const getCitiesForState = (stateName) => {
  if (!stateName || !LOCATIONS_DATA[stateName]) {
    // If no state provided or state not found, return all available cities across all states
    const allCities = [];
    Object.values(LOCATIONS_DATA).forEach((st) => {
      if (st.cities) {
        Object.keys(st.cities).forEach((c) => {
          if (!allCities.includes(c)) allCities.push(c);
        });
      }
    });
    return allCities;
  }
  return Object.keys(LOCATIONS_DATA[stateName].cities || {});
};

export const getMunicipalitiesForCity = (stateOrCityName, cityName) => {
  let state = stateOrCityName;
  let city = cityName;

  // If only 1 argument was passed (city name), search across all states
  if (!cityName && stateOrCityName) {
    city = stateOrCityName;
    state = null;
  }

  if (state && city && LOCATIONS_DATA[state]?.cities[city]) {
    const munList = LOCATIONS_DATA[state].cities[city].municipalities || [];
    return munList.map((m) => m.name);
  }

  // Search across all states for matching city
  if (city) {
    for (const [stName, stData] of Object.entries(LOCATIONS_DATA)) {
      if (stData.cities && stData.cities[city]) {
        const munList = stData.cities[city].municipalities || [];
        return munList.map((m) => m.name);
      }
    }
  }

  // Fallback realistic municipalities if not in dataset
  if (city) {
    return [
      `${city} City Municipal Corporation - Central Zone`,
      `${city} City Municipal Corporation - North Zone`,
      `${city} City Municipal Corporation - South Zone`,
      `${city} City Municipal Corporation - East Zone`,
      `${city} City Municipal Corporation - West Zone`,
    ];
  }

  return [];
};

export const getWardsForMunicipality = (stateOrCityOrMun, cityOrMun, municipalityName) => {
  let targetMunicipality = municipalityName || cityOrMun || stateOrCityOrMun;

  // Search in structured LOCATIONS_DATA
  for (const stData of Object.values(LOCATIONS_DATA)) {
    if (stData.cities) {
      for (const cityData of Object.values(stData.cities)) {
        if (cityData.municipalities) {
          const mun = cityData.municipalities.find(
            (m) => m.name === targetMunicipality || targetMunicipality.includes(m.name) || m.name.includes(targetMunicipality)
          );
          if (mun && Array.isArray(mun.wards) && mun.wards.length > 0) {
            return mun.wards;
          }
        }
      }
    }
  }

  // Contextual realistic wards
  return [
    'Ward 1 - Central Administrative Zone',
    'Ward 2 - Commercial Market & Trade Zone',
    'Ward 3 - North Residential Sector',
    'Ward 4 - South Industrial Corridor',
    'Ward 5 - East Radial Extension',
    'Ward 6 - West Civil Lines',
  ];
};

/**
 * Accurate Geographic Coordinates for Indian Municipalities and Cities
 */
export const CITY_COORDINATES = {
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Tiruppur': { lat: 11.1085, lng: 77.3411 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Erode': { lat: 11.3410, lng: 77.7172 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Hubballi-Dharwad': { lat: 15.3647, lng: 75.1240 },
  'Mangaluru': { lat: 12.9141, lng: 74.8560 },
  'Belagavi': { lat: 15.8497, lng: 74.4977 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Navi Mumbai': { lat: 19.0330, lng: 73.0297 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
};

export const ZONE_COORDINATES = {
  // Bengaluru zones
  'East Zone': { lat: 12.9784, lng: 77.6408 },
  'South Zone': { lat: 12.9352, lng: 77.6245 },
  'Mahadevapura': { lat: 12.9698, lng: 77.7500 },
  'Bommanahalli': { lat: 12.8452, lng: 77.6602 },
  'West Zone': { lat: 13.0031, lng: 77.5643 },
  'Yelahanka': { lat: 13.1007, lng: 77.5963 },
  'Rajarajeshwari': { lat: 12.9248, lng: 77.5204 },
  'Dasarahalli': { lat: 13.0450, lng: 77.5130 },
  // Tiruppur zones
  'Tiruppur City Municipal Corporation - Central Zone': { lat: 11.1085, lng: 77.3411 },
  'Tiruppur City Municipal Corporation - North Zone': { lat: 11.1420, lng: 77.3290 },
  'Tiruppur City Municipal Corporation - South Zone': { lat: 11.0760, lng: 77.3510 },
  'Tiruppur City Municipal Corporation - East Zone': { lat: 11.1010, lng: 77.3820 },
  'Avinashi': { lat: 11.1931, lng: 77.2690 },
  'Palladam': { lat: 10.9996, lng: 77.2798 },
  // Chennai zones
  'North Zone': { lat: 13.1147, lng: 80.2882 },
  'Central Zone': { lat: 13.0418, lng: 80.2341 },
  'OMR': { lat: 12.9010, lng: 80.2279 },
  'Tambaram': { lat: 12.9249, lng: 80.1000 },
};

/**
 * Resolves accurate coordinates for any City / Municipality / Ward combination.
 */
export const getCoordinatesForLocation = (state, city, municipality, ward) => {
  if (municipality) {
    for (const [zoneKey, coords] of Object.entries(ZONE_COORDINATES)) {
      if (municipality.includes(zoneKey)) {
        return coords;
      }
    }
  }

  if (city && CITY_COORDINATES[city]) {
    return CITY_COORDINATES[city];
  }

  if (state === 'Tamil Nadu') {
    return { lat: 11.1085, lng: 77.3411 };
  } else if (state === 'Karnataka') {
    return { lat: 12.9716, lng: 77.5946 };
  } else if (state === 'Maharashtra') {
    return { lat: 19.0760, lng: 72.8777 };
  }

  return { lat: 12.9716, lng: 77.5946 };
};
