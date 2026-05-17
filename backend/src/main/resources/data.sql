-- ================================================================
-- DISASTER RESPONSE SYSTEM — COMPLETE DATA SEED
-- Runs on every startup via spring.sql.init.mode=always
-- DELETE + INSERT pattern ensures questions are always fresh
-- ================================================================

-- Disable FK checks so we can delete in any order
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data so re-runs don't duplicate
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE questions;
TRUNCATE TABLE scenarios;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

-- ── SCENARIOS ─────────────────────────────────────────────────
INSERT INTO scenarios (id, name, icon, description, color) VALUES
(1, 'Flood',      '🌊', 'Learn life-saving flood response protocols, evacuation procedures, water safety and post-flood recovery measures.', '#3b82f6'),
(2, 'Earthquake', '🌍', 'Master earthquake safety including Drop-Cover-Hold, building collapse response and aftershock preparedness.', '#f59e0b'),
(3, 'Fire',       '🔥', 'Understand fire prevention, PASS technique for extinguishers, evacuation routes and burn treatment.', '#ef4444'),
(4, 'Cyclone',    '🌀', 'Prepare for cyclones with early warning recognition, shelter-in-place protocols and post-storm safety.', '#8b5cf6'),
(5, 'Landslide',  '⛰️', 'Identify landslide warning signs, trigger factors and learn emergency slope-failure response.', '#10b981'),
(6, 'Tsunami',    '🌊', 'Recognize tsunami warning signs, understand wave behaviour and master coastal evacuation to high ground.', '#06b6d4');

-- ================================================================
-- FLOOD — 20 Questions  (scenario_id = 1)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What should you do FIRST when a flood warning is issued?',
'["Move to higher ground immediately","Wait to confirm the flood","Pack all valuables first","Call neighbours first"]',
'Move to higher ground immediately',
'When a flood warning is issued, moving to higher ground is the immediate priority. Every minute counts as rapidly rising water can trap you.',
1),

('How much fast-moving water can knock an adult off their feet?',
'["6 inches (15 cm)","2 feet (60 cm)","1 foot (30 cm)","4 feet (120 cm)"]',
'6 inches (15 cm)',
'Just 6 inches of fast-moving floodwater is enough to knock an adult off their feet. Never attempt to walk through moving floodwater.',
1),

('What depth of moving water can sweep away a small car?',
'["1 foot (30 cm)","2 feet (60 cm)","3 feet (90 cm)","4 feet (120 cm)"]',
'2 feet (60 cm)',
'Just 2 feet of moving water can sweep away a small car. Never drive through flooded roads — most flood deaths occur in vehicles.',
1),

('Which item is MOST critical in a flood emergency kit?',
'["Extra clothing","Waterproof torch and battery radio","Cooking equipment","Board games"]',
'Waterproof torch and battery radio',
'A waterproof torch and battery radio are most critical. The torch helps navigate darkness while the radio provides emergency alerts without electricity.',
1),

('What is the safest water source during a flood?',
'["River or stream water","Flood water filtered through cloth","Bottled or boiled water only","Tap water if it still flows"]',
'Bottled or boiled water only',
'Floodwater is contaminated with sewage, chemicals and bacteria. Only use sealed bottled water or water boiled for at least 1 minute.',
1),

('If trapped in a car swept by floodwater, you should:',
'["Stay inside and wait","Open window slightly and wait","Kick out window and swim when car stabilises","Honk horn continuously"]',
'Kick out window and swim when car stabilises',
'As a car fills with water, pressure equalises allowing doors to open. Kick out the window once the car stops moving, then swim to safety.',
1),

('What is the difference between a Flood Watch and a Flood Warning?',
'["They mean the same thing","Watch means possible flooding; Warning means flooding is occurring or imminent","Watch is more dangerous than Warning","Warning means flooding has already ended"]',
'Watch means possible flooding; Warning means flooding is occurring or imminent',
'A Flood Watch means conditions favour flooding — stay alert. A Flood Warning means flooding is happening or imminent — take immediate action.',
1),

('What electrical action is most important before floodwater enters your home?',
'["Turn off all lights","Turn off the main electrical breaker","Unplug only the television","Leave everything on so you can see"]',
'Turn off the main electrical breaker',
'Water and electricity are a deadly combination. Turning off the main breaker prevents electrocution if floodwater reaches outlets or wiring.',
1),

('After a flood, why is immediate re-entry to your home dangerous?',
'["The home is too cold","Structural damage, contaminated water and gas leaks may be present","Flood insurance will be voided","Neighbours may steal belongings"]',
'Structural damage, contaminated water and gas leaks may be present',
'Floodwater weakens foundations. Hidden structural damage, sewage contamination and gas leaks (from broken pipes) make immediate re-entry extremely dangerous.',
1),

('What does NDRF stand for in India disaster response?',
'["National Disaster Relief Force","National Disaster Response Force","Natural Disaster Rescue Foundation","National Defence Relief Fund"]',
'National Disaster Response Force',
'NDRF is India specialised force for disaster response. They lead rescue operations during floods, earthquakes and other major disasters.',
1),

('What should you NOT do during a flood evacuation?',
'["Take your emergency kit","Turn off utilities before leaving","Walk through moving flood water","Follow official evacuation routes"]',
'Walk through moving flood water',
'Walking through moving floodwater is extremely dangerous. Just 6 inches of fast water can knock you down and carry you away.',
1),

('What is the most dangerous type of flood?',
'["River flood","Coastal flood","Flash flood","Urban flood"]',
'Flash flood',
'Flash floods develop within 6 hours of heavy rain with little warning, move extremely fast and deliver walls of water with tremendous destructive force.',
1),

('During a flood, which floor of a building is safest to shelter on?',
'["Ground floor for easy exit","Basement with supplies","Highest accessible floor","Middle floor"]',
'Highest accessible floor',
'Move to the highest accessible floor during a flood. Avoid basements — they fill rapidly and trap people. The roof is a last resort if water keeps rising.',
1),

('What does the campaign Turn Around Do Not Drown refer to?',
'["A swimming safety rule","Never drive or walk through flooded roads","How to escape a whirlpool","Flood evacuation direction"]',
'Never drive or walk through flooded roads',
'Turn Around Do Not Drown warns people never to drive or walk through flooded roads. Just 2 feet of water can sweep away a vehicle.',
1),

('Which documents should be kept in a waterproof container in your flood kit?',
'["Favourite books","Identity documents, insurance papers and bank details","Old newspapers","Spare clothing only"]',
'Identity documents, insurance papers and bank details',
'Identity documents, insurance papers and bank details are critical for post-flood recovery and insurance claims. Always keep them waterproofed.',
1),

('What is a levee and what risk does it pose?',
'["A type of flood shelter","A barrier that holds back water but can fail catastrophically","A water purification system","An early warning sensor"]',
'A barrier that holds back water but can fail catastrophically',
'A levee holds back floodwaters but when it fails, it does so suddenly — releasing enormous amounts of water rapidly and creating extreme flash flood conditions.',
1),

('How should you sanitise a flooded well before drinking from it?',
'["Pour boiling water into it","Add chlorine bleach solution then pump out the water","Wait for water to clear naturally","Filter with a cloth only"]',
'Add chlorine bleach solution then pump out the water',
'Flooded wells must be disinfected with chlorine bleach solution. Pump out the water and clean the well before use. Always test quality after disinfection.',
1),

('What colour flag marks a flood-safe evacuation route in India?',
'["Red flag","Green flag","Yellow flag","Blue flag"]',
'Green flag',
'Green flags mark flood-safe evacuation routes in India, guiding residents toward high ground and safety during flood emergencies.',
1),

('If you see someone being swept away by floodwater, what should you do?',
'["Jump in to save them","Call 112 and throw a rope or flotation device","Watch and wait for help","Tell them to swim harder"]',
'Call 112 and throw a rope or flotation device',
'Never jump into floodwater to rescue someone — you risk becoming a victim yourself. Call 112, then throw a rope, life ring or any floating object.',
1),

('What is the national disaster helpline number in India?',
'["100","101","1078","108"]',
'1078',
'India national disaster helpline is 1078, operated by NDMA. The general emergency number is 112 which also connects to disaster response teams.',
1);

-- ================================================================
-- EARTHQUAKE — 20 Questions  (scenario_id = 2)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What is the correct Drop Cover Hold On earthquake procedure?',
'["Stand in a doorway","Drop to hands and knees, cover head under sturdy table, hold on until shaking stops","Run outside immediately","Lie flat in an open area"]',
'Drop to hands and knees, cover head under sturdy table, hold on until shaking stops',
'Drop prevents being knocked down. Cover protects your head from debris. Hold On keeps you with your shelter as it moves. This is the globally recommended response.',
2),

('What percentage of earthquake injuries are caused by falling objects and debris?',
'["10%","25%","55%","80%"]',
'55%',
'About 55% of earthquake injuries result from falling objects and debris — not building collapse. This is why covering your head and neck is critical.',
2),

('If you are in bed when an earthquake strikes, you should:',
'["Run to a doorway immediately","Roll under the bed","Stay in bed and protect your head with a pillow","Run outside immediately"]',
'Stay in bed and protect your head with a pillow',
'Stay in bed and protect your head with a pillow. Most injuries happen when people run and are struck by falling debris. Modern mattresses provide some protection.',
2),

('Why are doorways NOT the safest place in modern buildings during an earthquake?',
'["Doorways are actually the safest place","Modern doorways are no stronger than other structural parts","Doors will slam and trap you","The floor is weaker near doors"]',
'Modern doorways are no stronger than other structural parts',
'The old doorway myth applies to unreinforced adobe buildings only. In modern construction, doorways provide no more protection and you risk injury from the swinging door.',
2),

('After an earthquake stops shaking, what should you check first?',
'["Turn on the TV for news","Check for injuries, smell for gas leaks, and expect aftershocks","Go outside to assess building damage","Call relatives immediately"]',
'Check for injuries, smell for gas leaks, and expect aftershocks',
'After shaking stops: check for injuries and provide first aid, check for gas leaks by smelling and listening for hissing, then prepare for aftershocks.',
2),

('If you smell gas after an earthquake, you should:',
'["Light a candle to find the source","Turn on lights to inspect","Open windows, leave immediately, call gas company from outside","Stay inside and call from your phone"]',
'Open windows, leave immediately, call gas company from outside',
'Gas leaks are extremely dangerous. Open windows to ventilate, leave without switching any lights on or off — sparks can ignite gas — then call from outside.',
2),

('What is an aftershock and how long can aftershocks continue?',
'["A smaller quake before the main one lasting hours","Smaller quakes after the main event lasting weeks or months","Same intensity as the main quake lasting days","A sound effect after the quake lasting minutes"]',
'Smaller quakes after the main event lasting weeks or months',
'Aftershocks can continue for weeks or months after the main earthquake. They can weaken already-damaged structures. Always respond with full Drop-Cover-Hold.',
2),

('If you are outside during an earthquake, you should:',
'["Run into the nearest building","Stay near power lines for support","Move to open area away from buildings and power lines","Lie flat anywhere on the ground"]',
'Move to open area away from buildings and power lines',
'The biggest outdoor danger is falling debris from buildings and downed power lines. Move to open ground clear of all hazards immediately.',
2),

('What is liquefaction during an earthquake?',
'["Water flooding into ground cracks","When wet soil temporarily behaves like liquid causing buildings to sink","The sound of underground water movement","Rivers overflowing due to earthquake shaking"]',
'When wet soil temporarily behaves like liquid causing buildings to sink',
'Liquefaction occurs when earthquake vibrations cause water-saturated soil to temporarily lose strength and behave like liquid. Buildings can sink, tilt or collapse.',
2),

('If trapped under debris after an earthquake, what should you do?',
'["Shout continuously for help","Tap on pipes or walls and shout only when you hear rescuers nearby","Try to dig yourself out immediately","Stay completely silent at all times"]',
'Tap on pipes or walls and shout only when you hear rescuers nearby',
'Tapping on pipes carries sound much further than your voice. Shouting continuously wastes energy and causes dust inhalation. Shout only when you hear rescuers.',
2),

('What does the Richter Scale measure?',
'["The height of tsunami waves","The magnitude or energy released by an earthquake","Future earthquake prediction","The ground shaking felt by people at a location"]',
'The magnitude or energy released by an earthquake',
'The Richter Scale measures earthquake magnitude — the energy released at the source. Each whole number increase represents 10 times more shaking.',
2),

('If in a crowded public place during an earthquake, you should:',
'["Rush to the nearest exit immediately","Drop away from windows and shelves and do not rush for exits","Follow the crowd wherever they go","Alert the manager first"]',
'Drop away from windows and shelves and do not rush for exits',
'Rushing to exits during shaking causes deadly stampedes. Drop and take cover away from windows, display shelves and hanging lights. Move to exits only after shaking stops.',
2),

('What causes most earthquake deaths in developing countries?',
'["Post-earthquake flooding","Poorly constructed buildings collapsing","Fires after the earthquake","Landslides triggered by the earthquake"]',
'Poorly constructed buildings collapsing',
'The primary killer in earthquakes in developing countries is poorly constructed buildings. Properly designed reinforced concrete buildings survive major earthquakes.',
2),

('Which Indian region lies in seismic zone V, the most hazardous zone?',
'["Goa","Gujarat Kutch region and North-East India","Kerala","Tamil Nadu"]',
'Gujarat Kutch region and North-East India',
'Seismic Zone V includes the entire North-East, Kutch in Gujarat, parts of Uttarakhand and Himachal Pradesh, and the Andaman and Nicobar Islands.',
2),

('If driving when an earthquake occurs, you should:',
'["Speed up to escape the area fast","Stop carefully away from bridges and buildings and stay in the vehicle","Drive to the nearest open field","Leave the car and run"]',
'Stop carefully away from bridges and buildings and stay in the vehicle',
'Pull over away from bridges, overpasses, trees and buildings. Stay inside — the vehicle protects from falling debris. Switch on hazard lights and wait for shaking to stop.',
2),

('What should a complete earthquake emergency kit contain for 72 hours?',
'["Only water and food for one day","Water, food, first aid kit, torch, battery radio, medications and document copies","Just a torch and spare batteries","Only important documents"]',
'Water, food, first aid kit, torch, battery radio, medications and document copies',
'Earthquake kits should sustain you for 72 hours — the critical window before organised rescue arrives. Include 4 litres of water per person per day.',
2),

('What is seismic retrofitting?',
'["Building a brand new earthquake-resistant structure","Strengthening an existing building to improve its earthquake resistance","Installing earthquake sensors in buildings","Demolishing unsafe buildings after an earthquake"]',
'Strengthening an existing building to improve its earthquake resistance',
'Seismic retrofitting modifies existing structures to resist earthquake forces using methods like shear walls, steel bracing, base isolators and anchor bolts.',
2),

('What is the Triangle of Life concept and is it recommended by experts?',
'["The recommended Drop-Cover-Hold technique","It suggests sheltering next to large objects but experts universally prefer Drop-Cover-Hold","Three safe spots identified in every building","Three safe routes out of a building"]',
'It suggests sheltering next to large objects but experts universally prefer Drop-Cover-Hold',
'The Triangle of Life suggests sheltering next to large objects. However, emergency management experts universally recommend Drop-Cover-Hold as the evidence-based approach.',
2),

('What is the Mercalli Intensity Scale used for?',
'["Measuring total energy released at the earthquake source","Measuring felt intensity and damage at a specific location from I to XII","Predicting where future earthquakes will occur","Measuring the size of tsunami waves generated"]',
'Measuring felt intensity and damage at a specific location from I to XII',
'The Mercalli scale measures perceived shaking intensity and observed damage at specific locations, from I (not felt) to XII (total destruction). It varies by location unlike Richter.',
2),

('What percentage of the world earthquakes occur along the Pacific Ring of Fire?',
'["40%","60%","90%","25%"]',
'90%',
'About 90% of all earthquakes and 81% of the largest earthquakes occur along the Pacific Ring of Fire — a 40,000 km belt of seismic and volcanic activity.',
2);

-- ================================================================
-- FIRE — 20 Questions  (scenario_id = 3)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What does the acronym PASS stand for when using a fire extinguisher?',
'["Push Aim Squeeze Spray","Pull Aim Squeeze Sweep","Pull Activate Stand Spray","Push Activate Squeeze Sweep"]',
'Pull Aim Squeeze Sweep',
'PASS: Pull the pin, Aim the nozzle at the base of the fire, Squeeze the handle, Sweep side-to-side. Always aim at the BASE to extinguish the fuel, not the flames.',
3),

('What is the first action when you discover a fire?',
'["Grab your belongings","Try to extinguish it yourself immediately","Activate fire alarm and call 101 or 112","Open all windows to reduce smoke"]',
'Activate fire alarm and call 101 or 112',
'First alert people by activating the alarm and call 101 or 112. Only fight the fire yourself if it is very small, you have a clear exit behind you and a working extinguisher.',
3),

('What is the safest way to check if a door is safe to open during a fire?',
'["Open it quickly and check for flames","Touch the door near the top with the back of your hand","Kick it open from a distance","Open it slightly from the side"]',
'Touch the door near the top with the back of your hand',
'Touch the back of your hand to the door near the top where heat rises first. If hot, do not open — fire or superheated gases are on the other side. Find another exit.',
3),

('When escaping from a smoke-filled building, you should:',
'["Stand upright and run as fast as possible","Crawl low to the floor where air is cleaner","Cover your mouth only and walk quickly","Hold your breath the entire way out"]',
'Crawl low to the floor where air is cleaner',
'Smoke and toxic gases rise — the cleanest air is near the floor. Crawl below the smoke layer. Smoke inhalation causes approximately 75% of fire deaths.',
3),

('What class of extinguisher should be used on an electrical fire?',
'["Class A water extinguisher","Class B foam extinguisher","Class C or CO2 extinguisher","Class D dry powder for metals"]',
'Class C or CO2 extinguisher',
'Never use water on electrical fires — it conducts electricity and causes electrocution. CO2 and dry powder extinguishers are safe as they do not conduct electricity.',
3),

('What are the three elements of the fire triangle?',
'["Wind, rain and lightning","Heat, fuel and oxygen","Spark, material and air","Ignition, spread and oxygen"]',
'Heat, fuel and oxygen',
'The fire triangle: heat, fuel and oxygen. Remove any one element and fire dies. Fire suppression works by removing heat (water), fuel (clearing material) or oxygen (smothering).',
3),

('If your clothes catch fire, what should you do?',
'["Run to find water immediately","Wave your arms to cool the flames","Stop Drop and Roll","Remove the clothes as fast as possible"]',
'Stop Drop and Roll',
'Stop — running fans the flames. Drop to the ground covering your face. Roll over and over to smother the flames. Running causes severe face and head burns.',
3),

('What is the leading cause of home fire deaths globally?',
'["Kitchen cooking fires","Electrical wiring faults","Smoking materials left unattended","Candles left burning"]',
'Smoking materials left unattended',
'Smoking materials left unattended are the leading cause of home fire deaths globally. Smouldering material ignites bedding, furniture or rubbish, often while people sleep.',
3),

('How often should smoke alarms be tested?',
'["Once a year","Every 6 months","Every month","Only when moving into a new home"]',
'Every month',
'Smoke alarms should be tested monthly by pressing the test button. Batteries should be replaced at least annually. A working smoke alarm halves your risk of dying in a fire.',
3),

('If trapped in a room with fire outside the door, you should:',
'["Break the window and jump immediately","Seal door gaps with cloth and signal from the window","Hide under the bed","Open the window fully to breathe fresh air"]',
'Seal door gaps with cloth and signal from the window',
'Seal gaps under the door with clothing to slow smoke entry. Signal rescuers from the window with a bright cloth. Only jump from lower floors as an absolute last resort.',
3),

('What percentage of fire deaths are caused by smoke inhalation rather than burns?',
'["25%","50%","75%","90%"]',
'75%',
'Approximately 75% of fire deaths are caused by smoke inhalation, not burns. Toxic gases such as carbon monoxide and hydrogen cyanide incapacitate victims before flames reach them.',
3),

('What is a backdraft in a fire?',
'["When a fire spreads backwards through a building","A sudden violent explosion when oxygen rushes into an oxygen-depleted fire","The loud sound produced by a large fire","Wind pushing a fire backwards toward its origin"]',
'A sudden violent explosion when oxygen rushes into an oxygen-depleted fire',
'Backdraft occurs when a fire in an oxygen-depleted room suddenly receives fresh oxygen. The result is a violent explosive combustion. Smoke puffing from gaps and stained windows are warning signs.',
3),

('What should you do if a cooking oil or chip pan catches fire?',
'["Pour water on it immediately","Cover with a damp cloth or lid and turn off the heat","Move the pan to the sink","Blow out the flames like a candle"]',
'Cover with a damp cloth or lid and turn off the heat',
'Never pour water on a fat or oil fire — it causes a violent steam explosion that spreads burning oil. Smother with a fire blanket or damp cloth and turn off the heat source.',
3),

('What is the emergency fire service number in India?',
'["100","101","108","112"]',
'101',
'The dedicated fire emergency number in India is 101. The national emergency number 112 also connects to fire services. Know both numbers.',
3),

('How far should a fire assembly point be from a building?',
'["5 metres","10 metres","At least 15 to 20 metres","50 metres or more"]',
'At least 15 to 20 metres',
'Assembly points should be at least 15-20 metres from the building — far enough from smoke, falling debris and emergency vehicle access routes.',
3),

('What does fire load mean in building safety?',
'["The weight of firefighters entering a building","The total amount of combustible material present in a building","The maximum temperature a building can withstand","The number of fire exits required in a building"]',
'The total amount of combustible material present in a building',
'Fire load is the total combustible material in a building. High fire load means more intense and longer-burning fires — critical for planning evacuation times.',
3),

('Why is it dangerous to open windows during an active indoor fire?',
'["It makes the room colder","Fresh oxygen feeds the fire and causes it to intensify rapidly","It safely lets toxic gases escape","Open windows structurally weaken the building"]',
'Fresh oxygen feeds the fire and causes it to intensify rapidly',
'Opening windows introduces fresh oxygen which dramatically intensifies combustion. Even uncomfortable smoke actually slows fire spread by reducing available oxygen.',
3),

('What is a Class K fire extinguisher specifically designed for?',
'["Paper and wood fires","Electrical equipment fires","Kitchen grease and cooking oil fires","Flammable metal fires"]',
'Kitchen grease and cooking oil fires',
'Class K extinguishers target commercial kitchen fires involving cooking oils and greases, using wet chemical agents that cool and smother the fire without causing oil splatter.',
3),

('What is the safest escape route in a multi-storey building fire?',
'["Use the elevator for speed","Use the stairwell and stay low","Jump from windows above the ground floor","Shelter in the basement"]',
'Use the stairwell and stay low',
'Always use stairs during a fire — elevators can malfunction and elevator shafts act as chimneys drawing deadly smoke upward. Stay low in stairwells and check doors before opening.',
3),

('How often should a fire evacuation drill be conducted in a workplace or school?',
'["Once every 5 years","Once every 3 years","At least twice a year","Only when required by a fire inspector"]',
'At least twice a year',
'Conduct full evacuation drills at least twice a year at varying times. Regular drills reduce actual evacuation time by 30 to 50 percent during a real emergency.',
3);

-- ================================================================
-- CYCLONE — 20 Questions  (scenario_id = 4)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What is the eye of a cyclone?',
'["The most destructive outer part with the highest winds","A calm clear centre surrounded by the violent eyewall","The point where the cyclone makes landfall","The leading edge of the approaching storm system"]',
'A calm clear centre surrounded by the violent eyewall',
'The eye is a relatively calm clear area at the cyclone centre, typically 20 to 50 km wide. It is surrounded by the eyewall — the most violent part with the strongest winds.',
4),

('What should you do immediately on receiving a cyclone warning?',
'["Wait to see how severe it becomes before acting","Go to the beach to observe the approaching storm","Board windows, move to shelter, gather emergency supplies and charge all devices","Continue normal activities until an official evacuation order is given"]',
'Board windows, move to shelter, gather emergency supplies and charge all devices',
'On receiving a cyclone warning, immediately secure your home, gather your emergency kit, charge all devices, fill water containers and move to the nearest cyclone shelter.',
4),

('What is storm surge and why is it the deadliest cyclone hazard?',
'["Heavy rainfall that accompanies the cyclone","An abnormal rise in sea level driven by the cyclone that inundates coastal areas","Increased river flooding that follows after the cyclone","Strong wind gusts that occur during eye passage"]',
'An abnormal rise in sea level driven by the cyclone that inundates coastal areas',
'Storm surge is the deadliest cyclone hazard — an abnormal sea level rise of up to 10 or more metres caused by the cyclone low pressure and onshore winds. It strikes with little warning.',
4),

('During a cyclone, which room is the safest place to shelter?',
'["Any room with windows so you can monitor the storm","A room on the top floor of the building","An interior room on the lowest floor away from all windows","The garage with your car ready for quick evacuation"]',
'An interior room on the lowest floor away from all windows',
'The safest room is an interior room such as a bathroom or hallway on the lowest floor away from windows. Interior walls provide the greatest structural support.',
4),

('What should you absolutely NOT do when the cyclone eye passes over your location?',
'["Stay sheltered and wait","Go outside to check for damage or to let in fresh air","Call emergency services if needed","Check on family members inside the same building"]',
'Go outside to check for damage or to let in fresh air',
'Never go outside during the eye passage — it is deceptively calm. The violent eyewall arrives with full force within minutes to hours. Stay sheltered until the official all-clear.',
4),

('Which body of water generates the majority of cyclones affecting India?',
'["The Arabian Sea only","The Bay of Bengal — approximately 80 percent of Indian cyclones","The Indian Ocean south of Sri Lanka","The Pacific Ocean"]',
'The Bay of Bengal — approximately 80 percent of Indian cyclones',
'About 80% of cyclones affecting India originate in the Bay of Bengal. Its warm shallow waters and geography make it an ideal cyclone formation zone.',
4),

('What should you do with LPG cylinders before a cyclone makes landfall?',
'["Leave them connected for use during the storm","Turn off and disconnect cylinders then lay them flat indoors","Move them outside so they do not damage the house if they explode","Fill them completely before the storm arrives"]',
'Turn off and disconnect cylinders then lay them flat indoors',
'LPG cylinders must be turned off, disconnected from pipes and stored flat in a secure indoor location. A flying cylinder during a cyclone is an extremely dangerous projectile.',
4),

('How does India IMD classify cyclone intensity?',
'["Using Categories 1 through 5 based on wind speed","From Depression through Deep Depression to Super Cyclonic Storm","Using Levels A through F","Using Classes I through IV"]',
'From Depression through Deep Depression to Super Cyclonic Storm',
'IMD classifies in order of increasing intensity: Low Pressure Area, Depression, Deep Depression, Cyclonic Storm, Severe, Very Severe, Extremely Severe, and Super Cyclonic Storm.',
4),

('What does cyclone-proofing a home involve?',
'["Painting the home a specific recommended colour","Installing roof straps, fitting shutters, removing loose items and securing trees","Installing a large air conditioning system","Adding a basement shelter below the home"]',
'Installing roof straps, fitting shutters, removing loose items and securing trees',
'Cyclone proofing includes: roof tie-down straps, cyclone shutters on windows, removing loose outdoor items like furniture and pots, pruning overhanging branches and reinforcing doors.',
4),

('After a cyclone, what is the biggest invisible danger outside?',
'["Increased mosquito activity","Downed power lines and the risk of electrocution","Increased UV radiation from the sun","Cold temperatures following the storm"]',
'Downed power lines and the risk of electrocution',
'Downed power lines are the biggest post-cyclone danger. Assume all downed lines are live. Do not approach within 10 metres. Standing water near lines can conduct electricity lethally.',
4),

('What is the difference between a cyclone, a typhoon and a hurricane?',
'["They are different intensities of the same storm type","They are the same weather phenomenon named differently by region","They are completely different storm systems","They differ based on their direction of rotation"]',
'They are the same weather phenomenon named differently by region',
'Tropical cyclone, hurricane and typhoon describe the same rotating tropical storm. It is called a hurricane in the Atlantic, a typhoon in the Northwest Pacific and a cyclone in the Indian Ocean region.',
4),

('How far in advance does India IMD typically issue accurate cyclone forecasts?',
'["6 hours before landfall","12 hours before landfall","Up to 5 days with high accuracy maintained for 3 days","A maximum of 48 hours before landfall"]',
'Up to 5 days with high accuracy maintained for 3 days',
'IMD issues cyclone track forecasts up to 5 days in advance with high accuracy for the first 3 days. This improved early warning has dramatically reduced cyclone deaths in India.',
4),

('In which direction does a cyclone in the Bay of Bengal rotate?',
'["Clockwise","Anticlockwise","It varies based on local wind direction","It always moves from east to west"]',
'Anticlockwise',
'Due to the Coriolis effect, cyclones in the Northern Hemisphere rotate anticlockwise. Southern Hemisphere cyclones rotate clockwise. This rotation creates the characteristic spiral structure.',
4),

('What is the dangerous semicircle of a Northern Hemisphere cyclone?',
'["The calm eye area at the centre","The right-hand side where forward motion speed adds to rotational wind speed","The entire area covered by the cyclone track","The zone where storm surge is most severe"]',
'The right-hand side where forward motion speed adds to rotational wind speed',
'The right-hand side of a Northern Hemisphere cyclone track is most dangerous. The cyclone forward movement adds to the rotational wind speed, creating the highest wind zones there.',
4),

('Which Indian state is internationally recognised for its cyclone early warning and evacuation system?',
'["Gujarat","Kerala","Odisha","West Bengal"]',
'Odisha',
'Odisha transformed from over 10,000 deaths in the 1999 Super Cyclone to near-zero deaths in subsequent major cyclones including Phailin and Fani. Their system became a global model.',
4),

('How should you store important documents before a cyclone?',
'["Leave them in their usual drawers","Place in a waterproof bag and carry with you to the shelter","Upload photos to a computer only","Store in the attic where floodwater cannot reach"]',
'Place in a waterproof bag and carry with you to the shelter',
'Store identity documents, insurance papers and bank details in a waterproof bag. Take it when evacuating — these documents are critical for post-disaster relief claims.',
4),

('What causes the characteristic howling roaring sound of a severe cyclone?',
'["Thunder and lightning within the storm","Extremely high-speed winds interacting with structures, trees and terrain","Ocean waves crashing on the shoreline","Internal pressure changes within the cyclone system"]',
'Extremely high-speed winds interacting with structures, trees and terrain',
'The howling roaring sound is produced by extreme winds of 150 to 250 or more km/h interacting with buildings, trees, power lines and terrain, creating intense aerodynamic turbulence.',
4),

('What is the typical forward translation speed of a cyclone making landfall?',
'["100 to 200 km/h","50 to 80 km/h","10 to 30 km/h","Over 200 km/h"]',
'10 to 30 km/h',
'Cyclones move forward at only 10 to 30 km/h while their rotational winds spin much faster. This slow movement means a single cyclone can batter a coastal area for 12 to 24 hours.',
4),

('What are dedicated cyclone shelters in coastal India designed to withstand?',
'["Only moderate wind and rain","Extreme cyclone winds, storm surge inundation and high-velocity flying debris","Earthquakes as well as cyclones equally","Only storm surge flooding, not high winds"]',
'Extreme cyclone winds, storm surge inundation and high-velocity flying debris',
'Dedicated cyclone shelters in coastal Odisha and Andhra Pradesh are engineered to withstand winds of 250 or more km/h, storm surge inundation and high-velocity debris impact.',
4),

('What is the minimum emergency supply you should stockpile before cyclone season?',
'["One day of food and water only","Three days of food, water, first aid kit, torch, battery radio and medications","Only bottled water and candles","Just a torch and spare batteries"]',
'Three days of food, water, first aid kit, torch, battery radio and medications',
'Store at least 72 hours of supplies: food, water, first aid kit, waterproof torch, battery-powered radio, medications, extra batteries and important documents in a waterproof container.',
4);

-- ================================================================
-- LANDSLIDE — 20 Questions  (scenario_id = 5)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What is the most common trigger for landslides in mountainous India?',
'["Earthquakes shaking the slopes","Intense or prolonged rainfall that saturates the soil","Very strong winds","Rapid temperature changes between day and night"]',
'Intense or prolonged rainfall that saturates the soil',
'Intense or prolonged rainfall is the most common landslide trigger in India. Waterlogged soil loses its cohesion, dramatically reducing slope stability until failure occurs.',
5),

('Which combination of signs most reliably indicates an imminent landslide?',
'["Clear blue skies and dry warm weather","New cracks in soil, tilting trees, cracking sounds and rivers suddenly turning muddy","Wildlife moving rapidly to higher ground","Strong winds combined with cold temperatures"]',
'New cracks in soil, tilting trees, cracking sounds and rivers suddenly turning muddy',
'Key warning signs: new cracks in ground or road, tilting trees or utility poles, cracking sounds from the hillside, rivers turning suddenly turbid and small rock or soil falls starting.',
5),

('If a landslide is occurring and you are directly in its path, you should:',
'["Stand completely still and cover your head","Run perpendicular — sideways — away from the slide path","Run as fast as possible downhill away from the source","Climb the nearest tree for safety above the debris"]',
'Run perpendicular — sideways — away from the slide path',
'Move quickly at right angles to the landslide direction. Running downhill puts you directly in the flow path. If escape is impossible, curl into a tight ball protecting your head.',
5),

('What is a debris flow and how does it differ from a typical landslide?',
'["They are identical phenomena with different names","A debris flow is a fast-moving water-saturated mixture that travels faster and further than typical landslides","A debris flow contains only rocks without any soil","A debris flow always requires an earthquake as its trigger"]',
'A debris flow is a fast-moving water-saturated mixture that travels faster and further than typical landslides',
'Debris flows are water-saturated mixtures moving at up to 80 km/h — much faster than regular landslides. They can travel long distances and flow around obstacles, making them extremely dangerous.',
5),

('Which Indian regions are considered the highest landslide risk zones?',
'["Only the Himalayan mountain range","The Himalayan belt, North-Eastern states and the Western Ghats","The Deccan Plateau and Indo-Gangetic plains","Rajasthan and Gujarat desert regions"]',
'The Himalayan belt, North-Eastern states and the Western Ghats',
'India three high-risk landslide zones are: the Himalayan belt including Uttarakhand and Himachal Pradesh, the North-East states and the Western Ghats in Kerala and Karnataka.',
5),

('How does deforestation dramatically increase landslide risk?',
'["Deforestation has no measurable effect on landslide occurrence","Tree roots bind soil and absorb water — their removal leaves soil unanchored and waterlogged","Trees make slopes heavier so removing them actually reduces landslide risk","Deforestation only affects river flooding and not slope stability"]',
'Tree roots bind soil and absorb water — their removal leaves soil unanchored and waterlogged',
'Tree roots physically anchor soil to bedrock and absorb large quantities of rainwater. Deforestation removes both these stabilising functions, creating dangerous conditions during heavy rain.',
5),

('What should you do on receiving a landslide warning while living near a steep slope?',
'["Continue normal activities unless you can physically see movement","Evacuate immediately to low flat ground away from the slope","Move to higher ground further up the same slope","Dig protective trenches around the foundation of your home"]',
'Evacuate immediately to low flat ground away from the slope',
'Evacuate immediately to low flat ground. Tell neighbours and alert authorities. Do not return until officials confirm the slope is stable — secondary slides are very common.',
5),

('What is the key difference between a rockfall and a landslide?',
'["They are the exact same phenomenon with different names","Rockfall involves individual rocks freefalling or bouncing; landslides involve a large mass of material moving together","Rockfall only occurs beneath bodies of water","Landslides are always much slower than rockfalls in every situation"]',
'Rockfall involves individual rocks freefalling or bouncing; landslides involve a large mass of material moving together',
'Rockfall involves individual rocks detaching and falling, bouncing or rolling down steep slopes. Landslides involve the coherent movement of a larger mass of soil, rock and debris.',
5),

('Why are mountain roads dangerous for several days after heavy rainfall?',
'["Road surfaces become too slippery to drive on safely","Slopes remain saturated for days and secondary landslides can block or destroy roads without warning","Mountain roads only need to be avoided during active rainfall events","Landslides never have delayed occurrence after rain has stopped"]',
'Slopes remain saturated for days and secondary landslides can block or destroy roads without warning',
'Soil remains waterlogged for days after heavy rain, meaning slope failures can occur well after rainfall stops. Avoid mountain roads for 48 to 72 hours after heavy rain in landslide zones.',
5),

('What is a lahar and what typically triggers it?',
'["A type of intense local earthquake in mountainous areas","A fast-moving volcanic mudflow triggered by volcanic eruptions or heavy rain on volcanic slopes","A tsunami generated by an underwater landslide","A flash flood that occurs in a narrow canyon or gorge"]',
'A fast-moving volcanic mudflow triggered by volcanic eruptions or heavy rain on volcanic slopes',
'A lahar is a destructive mudflow of volcanic material and water. They can travel at 60 or more km/h and extend great distances along river valleys below volcanic slopes.',
5),

('What is the primary structural purpose of a retaining wall built on a slope?',
'["To provide privacy between neighbouring properties","To hold back soil and prevent slope failure by providing structural resistance to downslope movement","To channel rainwater safely away from buildings","To clearly mark property boundaries on steep terrain"]',
'To hold back soil and prevent slope failure by providing structural resistance to downslope movement',
'Retaining walls provide structural resistance against soil movement. They must be designed by qualified engineers and must include drainage provisions — poorly built walls can trap water and worsen failure risk.',
5),

('After a landslide blocks a river, what dangerous secondary event can occur?',
'["The river permanently changes course and dries up upstream","A landslide dam forms that can breach suddenly causing catastrophic flash flooding downstream","The blocked river triggers earthquakes in the surrounding area","The river permanently changes its direction of flow"]',
'A landslide dam forms that can breach suddenly causing catastrophic flash flooding downstream',
'When a landslide blocks a river, a natural dam forms. These landslide dams are structurally unstable and can breach suddenly, releasing the impounded water as a catastrophic flash flood.',
5),

('What sensors do modern landslide early warning systems use to detect slope movement?',
'["Satellite images alone are sufficient","Rainfall sensors, soil moisture sensors, GPS displacement monitors and crack meters combined","Only human visual observation of slopes","Weather balloons and atmospheric sensors"]',
'Rainfall sensors, soil moisture sensors, GPS displacement monitors and crack meters combined',
'Modern systems combine: rainfall gauges for threshold monitoring, soil moisture sensors, GPS measuring millimetre-level displacement, crack meters and automated alarms in centralised monitoring.',
5),

('How should you help someone partially buried under landslide debris?',
'["Pull them out forcefully by their arms or legs immediately","Call 112, carefully remove debris from their face and airway first, and do not move suspected spinal injuries","Leave them in place and go get professional help","Cover them with a blanket and wait passively"]',
'Call 112, carefully remove debris from their face and airway first, and do not move suspected spinal injuries',
'Call 112 immediately. Carefully clear debris from the face and airway first to ensure breathing. Do not forcefully pull them — they may have spinal or crush injuries. Keep them warm and calm.',
5),

('What long-term community measure most effectively reduces landslide risk?',
'["Building progressively taller buildings on slopes","Afforestation, proper land-use planning, drainage management and slope monitoring combined","Issuing public warnings when rain is forecast only","Constructing more roads on hillsides to improve access"]',
'Afforestation, proper land-use planning, drainage management and slope monitoring combined',
'Long-term risk reduction requires: afforestation to stabilise slopes, strict land-use planning, proper surface and subsurface drainage infrastructure, slope stabilisation works and community early warning systems.',
5),

('At which slope angle range do most landslides typically occur?',
'["Less than 10 degrees — very gentle slopes","Between 25 and 45 degrees — moderate to steep slopes","Greater than 80 degrees — near vertical slopes","Exactly 90 degrees — vertical cliff faces only"]',
'Between 25 and 45 degrees — moderate to steep slopes',
'Most landslides occur on slopes between 25 and 45 degrees. Below 25 degrees gravity is insufficient for most failures. Above 45 degrees, material tends to erode continually rather than accumulating for a large slide.',
5),

('What role does the Geological Survey of India play regarding landslides?',
'["GSI only studies rocks and minerals and not landslide hazards","GSI maps landslide hazard zones and investigates major landslide events across India","GSI manages only earthquake risk not landslide risk","GSI provides only weather forecasts for mountainous areas"]',
'GSI maps landslide hazard zones and investigates major landslide events across India',
'GSI maintains the National Landslide Susceptibility Mapping programme covering all Indian states, investigates major events and provides technical guidance for disaster management authorities.',
5),

('How does vegetation cover stabilise slopes and reduce landslide risk?',
'["Vegetation has no measurable effect on slope stability","Roots mechanically bind soil to bedrock and leaf canopies intercept rainfall reducing erosion and saturation","Heavy tree cover actually causes more landslides due to added weight","Only very large mature trees provide any meaningful slope protection"]',
'Roots mechanically bind soil to bedrock and leaf canopies intercept rainfall reducing erosion and saturation',
'Vegetation stabilises slopes through: root reinforcement binding soil to bedrock, canopy interception of rainfall reducing impact erosion, and water uptake reducing overall soil saturation.',
5),

('Which major Himalayan disaster in 2013 was caused by massive landslides and flash floods?',
'["The Bhuj earthquake in Gujarat","The Kedarnath disaster in Uttarakhand","The Bhola cyclone in Bengal","The Chilika cyclone in Odisha"]',
'The Kedarnath disaster in Uttarakhand',
'The June 2013 Kedarnath disaster involved intense rainfall triggering massive landslides and flash floods in Uttarakhand, killing over 5,000 people. It remains one of India worst landslide catastrophes.',
5),

('What is the best building practice to reduce risk in landslide-vulnerable areas?',
'["Build directly on the slope itself to get the best views","Avoid high-risk slopes, use reinforced foundations and install proper surface and subsurface drainage channels","Use only lightweight wooden structures on all slope sites","Build as close to rivers as possible for easy water access"]',
'Avoid high-risk slopes, use reinforced foundations and install proper surface and subsurface drainage channels',
'Best practices: avoid building on or at the base of steep slopes, use deep reinforced foundations, install adequate drainage channels and plant ground-cover vegetation to stabilise surrounding soil.',
5);

-- ================================================================
-- TSUNAMI — 20 Questions  (scenario_id = 6)
-- ================================================================
INSERT INTO questions (question, options, correct_answer, explanation, scenario_id) VALUES

('What is the most reliable natural warning sign of an approaching tsunami?',
'["Dark threatening clouds appearing on the horizon","A strong earthquake followed by the sea dramatically receding or a loud roaring sound","Heavy rainfall and thunderstorms just before the wave","A sudden bright rainbow appearing over the ocean"]',
'A strong earthquake followed by the sea dramatically receding or a loud roaring sound',
'Natural warnings: a strong undersea earthquake, the sea rapidly receding and exposing the seabed, or a loud roaring sound like a freight train. Any of these signs means evacuate immediately.',
6),

('How fast can tsunami waves travel across the open deep ocean?',
'["10 to 20 km/h — similar to a bicycle","50 to 100 km/h — similar to a car on a highway","Up to 800 km/h — similar to a commercial jet aircraft","200 to 400 km/h — similar to a high-speed train"]',
'Up to 800 km/h — similar to a commercial jet aircraft',
'In deep ocean, tsunami waves travel at up to 800 km/h. They slow dramatically and increase in height as they approach shallow coastal water, giving limited warning time.',
6),

('If you feel a strong earthquake while standing on or near the coast, what should you do?',
'["Wait for an official siren or tsunami warning before evacuating","Evacuate inland to high ground immediately without waiting for any official warning","Go to the beach to observe whether the ocean is behaving unusually","Go to the top floor of the nearest beachfront building"]',
'Evacuate inland to high ground immediately without waiting for any official warning',
'If you feel a strong earthquake near the coast, treat it as a tsunami warning and evacuate immediately. Tsunamis can arrive in minutes — official warnings may come too late. If in doubt, get out.',
6),

('What minimum height above sea level should you aim for when evacuating from a tsunami?',
'["5 metres above sea level","10 metres above sea level","At least 30 metres above sea level or 3 km inland","Just 1 metre above sea level"]',
'At least 30 metres above sea level or 3 km inland',
'Aim for at least 30 metres above sea level or 3 or more km inland, whichever is further. Large tsunamis can reach well beyond these minimums — always go as high as possible.',
6),

('How many waves does a tsunami typically consist of?',
'["Always just a single large wave","Always exactly two waves","A series of 3 to 10 or more waves where the first is not necessarily the largest","Always exactly three waves in every tsunami event"]',
'A series of 3 to 10 or more waves where the first is not necessarily the largest',
'A tsunami is a series of waves, called a wave train. There may be 3 to 10 or more waves spaced 10 to 60 minutes apart. The first wave is often NOT the largest. Never return until authorities declare safety.',
6),

('What is the primary cause of approximately 80 percent of all tsunamis?',
'["Very large tropical storms and hurricanes","Large undersea earthquakes of magnitude 7.5 or greater causing vertical seafloor displacement","Extremely high tides occurring during a full moon","Volcanic eruptions on land near coastlines"]',
'Large undersea earthquakes of magnitude 7.5 or greater causing vertical seafloor displacement',
'About 80% of tsunamis are caused by large undersea earthquakes (M7.5+) that produce vertical displacement of the ocean floor, displacing the water column and generating waves.',
6),

('Why does the ocean recede dramatically away from the shore before a tsunami wave arrives?',
'["The earthquake pulled the water permanently backwards out to sea","The trough of the tsunami wave arrives at the shore before the crest does","Tidal patterns change direction during a major earthquake","Strong offshore winds drive the water away from the shoreline"]',
'The trough of the tsunami wave arrives at the shore before the crest does',
'When the trough of a tsunami wave arrives first, water is pulled dramatically away from shore, sometimes exposing the seabed for hundreds of metres. The massive crest follows within minutes — run immediately.',
6),

('Approximately how many people did the 2004 Indian Ocean Tsunami kill across how many countries?',
'["10,000 people across 3 countries","227,000 people across 14 countries","50,000 people across 5 countries","500,000 people across 20 countries"]',
'227,000 people across 14 countries',
'The 2004 Indian Ocean Tsunami triggered by a M9.1 earthquake off Sumatra killed approximately 227,000 people across 14 countries — one of the deadliest natural disasters in recorded human history.',
6),

('If you absolutely cannot reach high ground during a tsunami, what is the last resort action?',
'["Stand at the beach and attempt to swim over the incoming waves","Climb to the highest floor or roof of the tallest solid nearby building as an absolute last resort","Hide inside a parked car or vehicle near the beach","Take shelter underneath a bridge or elevated roadway"]',
'Climb to the highest floor or roof of the tallest solid nearby building as an absolute last resort',
'As an absolute LAST RESORT, climb to the highest floor or roof of the nearest tall solid reinforced concrete building. Wooden structures can be swept away. Always prioritise inland evacuation first.',
6),

('What is INCOIS and what is its critical role in India tsunami safety?',
'["A non-governmental organisation based in Chennai","INCOIS in Hyderabad operates India tsunami early warning system monitoring seismic activity and issuing alerts","A private meteorological company based in Mumbai","A tsunami warning system based exclusively in the Andaman Islands"]',
'INCOIS in Hyderabad operates India tsunami early warning system monitoring seismic activity and issuing alerts',
'INCOIS (Indian National Centre for Ocean Information Services) in Hyderabad monitors seismic events and sea-level gauges 24/7, issuing Indian Ocean tsunami alerts within 10 minutes of a triggering earthquake.',
6),

('What is the critical difference between a local tsunami and a tele-tsunami?',
'["They are exactly the same phenomenon with different names","Local tsunamis originate nearby and arrive in minutes; tele-tsunamis travel thousands of km and take hours","Tele-tsunamis are always significantly less dangerous than local tsunamis","Local tsunamis only affect rivers and not the open ocean coastline"]',
'Local tsunamis originate nearby and arrive in minutes; tele-tsunamis travel thousands of km and take hours',
'Local tsunamis originate within 100 km and arrive in 5 to 30 minutes — too fast for official warnings. Tele-tsunamis travel thousands of kilometres and take hours, allowing time for official warnings.',
6),

('Which part of India coastline is considered most vulnerable to tsunamis?',
'["The west coast along the Arabian Sea","The east coast and the Andaman and Nicobar Islands due to proximity to active subduction zones","The northern coast near the Bangladesh border","Both the east and west coasts are equally vulnerable"]',
'The east coast and the Andaman and Nicobar Islands due to proximity to active subduction zones',
'India east coast and the Andaman and Nicobar Islands are most vulnerable. The Sunda subduction zone off Sumatra and the Andaman subduction zone are the primary tsunami sources affecting India.',
6),

('What makes the Andaman and Nicobar Islands exceptionally vulnerable to locally generated tsunamis?',
'["Their very high average elevation above sea level","They sit directly above an active subduction zone giving less than 5 minutes warning for local tsunamis","They attract more tourists than any other Indian region","They currently have no tsunami early warning system in operation"]',
'They sit directly above an active subduction zone giving less than 5 minutes warning for local tsunamis',
'The Andaman and Nicobar Islands sit directly above the Burma Plate subduction zone. Local earthquakes can generate tsunamis arriving in under 5 minutes — before any official warning can be issued.',
6),

('What does a blue and white tsunami hazard zone sign mean when you see one on a coastline?',
'["The area is a designated safe zone for swimming","The area is at risk of tsunami inundation — you should know the nearest evacuation route","The sign marks the location of a tsunami research station","The sign marks a historical tsunami memorial site"]',
'The area is at risk of tsunami inundation — you should know the nearest evacuation route',
'Blue and white tsunami hazard signs mark areas at risk of tsunami inundation. When visiting any coastal area displaying these signs, immediately identify your nearest evacuation route and high ground.',
6),

('When is it safe to return to the coastline after a tsunami has occurred?',
'["As soon as the first destructive wave has completely passed","After waiting a minimum of 30 minutes from the first wave","Only when official authorities formally declare the entire area safe","After 2 hours have passed from the initial wave impact"]',
'Only when official authorities formally declare the entire area safe',
'NEVER return without official all-clear. Tsunami wave trains continue for 8 to 24 hours and later waves can be larger than the first. Many deaths occur when people return too early to check on property.',
6),

('How do DART buoys in the Indian Ocean help detect and confirm tsunamis?',
'["They predict earthquakes before they happen using underwater sensors","Bottom pressure sensors detect the tiny pressure increase from a passing tsunami and transmit data instantly to warning centres","They physically block incoming tsunami waves with their hull structure","They are used exclusively for routine weather monitoring purposes"]',
'Bottom pressure sensors detect the tiny pressure increase from a passing tsunami and transmit data instantly to warning centres',
'DART buoys detect tiny pressure changes as a tsunami wave passes overhead and transmit data via satellite to warning centres within minutes, providing rapid confirmation of an actual tsunami.',
6),

('What is tsunami inundation mapping and how is it used to protect communities?',
'["A system for mapping the depth of the ocean floor in coastal areas","Computer modelling showing which land areas would be flooded by tsunamis, used for zoning and evacuation planning","A real-time system that monitors active flooding during a tsunami event","A mapping system that tracks the underwater location of earthquakes"]',
'Computer modelling showing which land areas would be flooded by tsunamis, used for zoning and evacuation planning',
'Inundation mapping uses numerical tsunami models to show which land areas would be flooded. These maps guide land-use zoning, evacuation route design, emergency planning and public education.',
6),

('Which natural coastal feature provides the best protection against tsunami wave energy?',
'["Wide flat sandy beaches","Dense coastal mangrove forests that absorb and dissipate wave energy","Tall concrete seawalls built along the shoreline","Rocky and jagged coastlines only"]',
'Dense coastal mangrove forests that absorb and dissipate wave energy',
'Mangrove forests act as natural buffers — their dense root systems and trunks absorb and dissipate tsunami wave energy. Studies after 2004 showed areas with intact mangroves suffered significantly less damage.',
6),

('What is the Pacific Tsunami Warning Center and what does it do?',
'["A private scientific research laboratory only","A NOAA facility in Hawaii that monitors global seismic and sea-level data and issues tsunami watches and warnings","An Indian government agency for tsunami early warning","A private commercial company offering tsunami insurance to coastal residents"]',
'A NOAA facility in Hawaii that monitors global seismic and sea-level data and issues tsunami watches and warnings',
'PTWC operated by NOAA in Hawaii since 1949 monitors global earthquakes and sea-level gauges 24/7, issuing tsunami watches, advisories and warnings for the Pacific and Indian Oceans.',
6),

('What is a Vertical Evacuation Structure and when would you use one?',
'["A normal tall apartment building that happens to be near the coast","A specially engineered structure providing refuge above inundation level when horizontal evacuation to high ground is impossible","A dedicated watchtower used for observing incoming tsunami waves","A floating rescue platform deployed offshore after a tsunami"]',
'A specially engineered structure providing refuge above inundation level when horizontal evacuation to high ground is impossible',
'Vertical Evacuation Structures are purpose-built reinforced structures placed where reaching high ground in time is impossible. They are designed to withstand tsunami wave forces and provide refuge for hundreds of people.',
6);

-- ================================================================
-- DEFAULT ADMIN USER
-- password: admin123  (BCrypt hashed)
-- ================================================================
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@disaster.com',
 '$2a$10$yFrYSaonMPppjK5r/DTUZ.dzvGLNkulRGKaOZNgkZcpbwgIrMo7fm',
 'ADMIN');
