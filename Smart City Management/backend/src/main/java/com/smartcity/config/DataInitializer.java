
package com.smartcity.config;

import com.smartcity.entity.*;
import com.smartcity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ComplaintCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() > 0) {
            ensureGovernmentAccounts();
            return;
        }

        System.out.println(">>> Initializing Smart Civic System seed data...");

        // 1. Seed Departments
        Department deptRoads = departmentRepository.save(Department.builder()
                .name("Roads & Infrastructure Department")
                .code("DEPT_ROADS")
                .description("Maintenance of arterial roads, asphalt resurfacing, footpaths, bridges, and flyovers.")
                .contactEmail("roads@municipality.gov.in")
                .contactPhone("080-22661001")
                .headOfficerName("Er. Rajesh Verma")
                .slaHours(48)
                .isActive(true)
                .build());

        Department deptWaste = departmentRepository.save(Department.builder()
                .name("Solid Waste Management Department")
                .code("DEPT_WASTE")
                .description("Garbage collection, community dumpsters, street sweeping, and recycling facilities.")
                .contactEmail("waste.mgmt@municipality.gov.in")
                .contactPhone("080-22661002")
                .headOfficerName("Dr. Anita Sundaram")
                .slaHours(24)
                .isActive(true)
                .build());

        Department deptWater = departmentRepository.save(Department.builder()
                .name("Water Supply & Sewerage Board")
                .code("DEPT_WATER")
                .description("Drinking water pipelines, leakage rectification, sewage network, and water quality testing.")
                .contactEmail("water.board@municipality.gov.in")
                .contactPhone("080-22661003")
                .headOfficerName("Er. Vikram Kulkarni")
                .slaHours(24)
                .isActive(true)
                .build());

        Department deptElectric = departmentRepository.save(Department.builder()
                .name("Electricity & Public Lighting Department")
                .code("DEPT_ELECTRIC")
                .description("Smart LED streetlighting, transformer maintenance, underground cabling, and electric safety.")
                .contactEmail("lighting@municipality.gov.in")
                .contactPhone("080-22661004")
                .headOfficerName("Er. Suresh Nair")
                .slaHours(24)
                .isActive(true)
                .build());

        Department deptDrainage = departmentRepository.save(Department.builder()
                .name("Drainage & Stormwater Department")
                .code("DEPT_DRAINAGE")
                .description("Stormwater drains, desilting, culverts, flood mitigation, and manhole cover security.")
                .contactEmail("drainage@municipality.gov.in")
                .contactPhone("080-22661005")
                .headOfficerName("Er. Ramesh Rao")
                .slaHours(36)
                .isActive(true)
                .build());

        Department deptTraffic = departmentRepository.save(Department.builder()
                .name("Traffic & Public Safety Department")
                .code("DEPT_TRAFFIC")
                .description("Traffic signage, pedestrian zebra crossings, bollards, speed breakers, and road barricades.")
                .contactEmail("traffic.civic@municipality.gov.in")
                .contactPhone("080-22661006")
                .headOfficerName("Officer Meera Joshi")
                .slaHours(48)
                .isActive(true)
                .build());

        // 2. Seed Complaint Categories
        ComplaintCategory catPothole = categoryRepository.save(ComplaintCategory.builder()
                .name("Potholes & Road Damage")
                .code("ROADS")
                .description("Crater potholes, broken asphalt, uneven road surfaces, damaged speed breakers.")
                .icon("AlertTriangle")
                .defaultPriority(Priority.MEDIUM)
                .defaultDepartment(deptRoads)
                .build());

        ComplaintCategory catGarbage = categoryRepository.save(ComplaintCategory.builder()
                .name("Garbage & Waste Accumulation")
                .code("SOLID_WASTE")
                .description("Overflowing bins, illegal garbage dumps, uncollected residential waste, dead animals.")
                .icon("Trash2")
                .defaultPriority(Priority.HIGH)
                .defaultDepartment(deptWaste)
                .build());

        ComplaintCategory catWater = categoryRepository.save(ComplaintCategory.builder()
                .name("Water Leakage & Pipeline Burst")
                .code("WATER_SUPPLY")
                .description("High-pressure pipeline leaks, low water pressure, contaminated tap water, valve leaks.")
                .icon("Droplets")
                .defaultPriority(Priority.HIGH)
                .defaultDepartment(deptWater)
                .build());

        ComplaintCategory catLight = categoryRepository.save(ComplaintCategory.builder()
                .name("Broken Streetlights & Electrical Hazards")
                .code("ELECTRICITY")
                .description("Non-functional streetlights, sparking electric poles, low-hanging cables, exposed wires.")
                .icon("Zap")
                .defaultPriority(Priority.MEDIUM)
                .defaultDepartment(deptElectric)
                .build());

        ComplaintCategory catDrain = categoryRepository.save(ComplaintCategory.builder()
                .name("Clogged Drains & Sewage Overflow")
                .code("DRAINAGE")
                .description("Open manholes, blocked stormwater gutters, sewage backup in residential streets.")
                .icon("Waves")
                .defaultPriority(Priority.HIGH)
                .defaultDepartment(deptDrainage)
                .build());

        ComplaintCategory catTraffic = categoryRepository.save(ComplaintCategory.builder()
                .name("Traffic Signals & Road Safety")
                .code("TRAFFIC_SAFETY")
                .description("Broken traffic signals, missing road signs, damaged guardrails, road obstruction.")
                .icon("ShieldAlert")
                .defaultPriority(Priority.MEDIUM)
                .defaultDepartment(deptTraffic)
                .build());

        // 3. Seed Users
        // Central Administration
        User admin = userRepository.save(User.builder()
                .fullName("Municipal Commissioner Sharma")
                .email("commissioner@central.gov.in")
                .password(passwordEncoder.encode("Admin@123"))
                .phoneNumber("9845012345")
                .role(Role.ROLE_ADMIN)
                .designation("Chief Municipal Commissioner")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User adminDirector = userRepository.save(User.builder()
                .fullName("Director Administration Rao")
                .email("director@central.gov.in")
                .password(passwordEncoder.encode("Admin@123"))
                .phoneNumber("9845012346")
                .role(Role.ROLE_ADMIN)
                .designation("Executive Director")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        // Government Department Heads
        User headRoads = userRepository.save(User.builder()
                .fullName("Er. Rajkumar Verma")
                .email("rajkumar.roads@gov.in")
                .password(passwordEncoder.encode("Head@123"))
                .phoneNumber("9845099001")
                .role(Role.ROLE_HEAD)
                .department(deptRoads)
                .designation("Chief Engineer & Department Head (Roads)")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User headSanitation = userRepository.save(User.builder()
                .fullName("Dr. Suresh Waste Head")
                .email("suresh.waste@gov.in")
                .password(passwordEncoder.encode("Head@123"))
                .phoneNumber("9845099002")
                .role(Role.ROLE_HEAD)
                .department(deptWaste)
                .designation("Chief Sanitation & Waste Management Head")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User headWater = userRepository.save(User.builder()
                .fullName("Er. Anita Water Head")
                .email("anita.water@gov.in")
                .password(passwordEncoder.encode("Head@123"))
                .phoneNumber("9845099003")
                .role(Role.ROLE_HEAD)
                .department(deptWater)
                .designation("Chief Hydraulic Engineer & Water Board Head")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User headElectric = userRepository.save(User.builder()
                .fullName("Er. Priya Electricity Head")
                .email("priya.electricity@gov.in")
                .password(passwordEncoder.encode("Head@123"))
                .phoneNumber("9845099004")
                .role(Role.ROLE_HEAD)
                .department(deptElectric)
                .designation("Chief Electrical Engineer & Lighting Head")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        // Municipal Officials
        User officerRoads = userRepository.save(User.builder()
                .fullName("Er. Alok Sharma")
                .email("alok@municipality.gov.in")
                .password(passwordEncoder.encode("Officer@123"))
                .phoneNumber("9845011111")
                .role(Role.ROLE_OFFICER)
                .department(deptRoads)
                .designation("Senior Executive Road Engineer")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User officerWaste = userRepository.save(User.builder()
                .fullName("Dr. Ananya Ray")
                .email("ananya@municipality.gov.in")
                .password(passwordEncoder.encode("Officer@123"))
                .phoneNumber("9845022222")
                .role(Role.ROLE_OFFICER)
                .department(deptWaste)
                .designation("Chief Sanitation Inspector")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User officerWater = userRepository.save(User.builder()
                .fullName("Er. Mohan Das")
                .email("mohan@municipality.gov.in")
                .password(passwordEncoder.encode("Officer@123"))
                .phoneNumber("9845033333")
                .role(Role.ROLE_OFFICER)
                .department(deptWater)
                .designation("Senior Hydraulic Engineer")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User officerElectric = userRepository.save(User.builder()
                .fullName("Er. Karthik Raman")
                .email("karthik@municipality.gov.in")
                .password(passwordEncoder.encode("Officer@123"))
                .phoneNumber("9845044444")
                .role(Role.ROLE_OFFICER)
                .department(deptElectric)
                .designation("Electrical Sub-Division Officer")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        // Citizens
        User citizenRahul = userRepository.save(User.builder()
                .fullName("Rahul Verma")
                .email("rahul.verma@example.com")
                .password(passwordEncoder.encode("Citizen@123"))
                .phoneNumber("9876543210")
                .role(Role.ROLE_CITIZEN)
                .address("Flat 402, Green Meadows, 12th Main Indiranagar")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        User citizenPriya = userRepository.save(User.builder()
                .fullName("Priya Deshmukh")
                .email("priya.deshmukh@example.com")
                .password(passwordEncoder.encode("Citizen@123"))
                .phoneNumber("9812345678")
                .role(Role.ROLE_CITIZEN)
                .address("House #56, Lake View Layout, Koramangala 4th Block")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .state("Karnataka")
                .isActive(true)
                .build());

        // 4. Seed Realistic Active Complaints
        // Complaint 1: In Progress
        Complaint c1 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000101")
                .citizen(citizenRahul)
                .title("Dangerous crater pothole causing vehicle damage near Metro Station")
                .description("A large and deep pothole has formed right in the middle of 100ft road near Metro Pillar 214. Multiple two-wheelers have skidded here during evening traffic.")
                .category(catPothole)
                .priority(Priority.HIGH)
                .status(ComplaintStatus.IN_PROGRESS)
                .address("100 Feet Road, Near Indiranagar Metro Station, Pillar 214")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Opposite Metro Station Exit 2")
                .pincode("560038")
                .latitude(12.9784)
                .longitude(77.6408)
                .aiClassification("Potholes & Road Damage")
                .aiPriorityConfidence(0.94)
                .aiPredictedDepartment("Roads & Infrastructure Department")
                .assignedDepartment(deptRoads)
                .assignedOfficer(officerRoads)
                .officialRemarks("Road repair crew and asphalt patching truck dispatched to site. Work under execution.")
                .slaDeadline(LocalDateTime.now().plusHours(18))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c1)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint filed by citizen Rahul Verma.")
                .updatedBy(citizenRahul)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c1)
                .status(ComplaintStatus.ASSIGNED)
                .remarks("Assigned to Senior Executive Road Engineer Alok Sharma.")
                .updatedBy(admin)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c1)
                .status(ComplaintStatus.IN_PROGRESS)
                .remarks("Cold-mix asphalt patching operation commenced on site.")
                .updatedBy(officerRoads)
                .build());

        // Complaint 2: Assigned to Sanitation Inspector (Solid Waste)
        Complaint c2 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000102")
                .citizen(citizenPriya)
                .title("Unattended garbage dump accumulating outside City Public School")
                .description("Garbage has not been collected for over 4 days. Waste is spilling onto the roadway and stray dogs are crowding the school gate, causing foul smell and health hazard.")
                .category(catGarbage)
                .priority(Priority.HIGH)
                .status(ComplaintStatus.IN_PROGRESS)
                .address("5th Cross Road, Koramangala 4th Block")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Adjacent to City Public School Gate 1")
                .pincode("560034")
                .latitude(12.9352)
                .longitude(77.6245)
                .aiClassification("Garbage & Waste Accumulation")
                .aiPriorityConfidence(0.96)
                .aiPredictedDepartment("Solid Waste Management Department")
                .assignedDepartment(deptWaste)
                .assignedOfficer(officerWaste)
                .officialRemarks("Sanitation truck #14 and 4 municipal workers deployed to clear waste accumulation.")
                .slaDeadline(LocalDateTime.now().plusHours(20))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c2)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint logged. AI flagged high risk due to school proximity.")
                .updatedBy(citizenPriya)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c2)
                .status(ComplaintStatus.ASSIGNED)
                .remarks("Assigned to Chief Sanitation Inspector Dr. Ananya Ray.")
                .updatedBy(admin)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c2)
                .status(ComplaintStatus.IN_PROGRESS)
                .remarks("Sanitation vehicle en route to Indiranagar dump site.")
                .updatedBy(officerWaste)
                .build());

        // Complaint 3: Critical Hazard (Assigned)
        Complaint c3 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000103")
                .citizen(citizenRahul)
                .title("Live exposed electric wire dangling from broken streetlight pole")
                .description("Severe hazard! Live wire has snapped and is hanging at eye level across the footpath near 8th Main Junction. Sparking observed during light drizzle.")
                .category(catLight)
                .priority(Priority.CRITICAL)
                .status(ComplaintStatus.ASSIGNED)
                .address("8th Main, Indiranagar 2nd Stage")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Near Post Office Junction")
                .pincode("560038")
                .latitude(12.9719)
                .longitude(77.6412)
                .aiClassification("Broken Streetlights & Electrical Hazards")
                .aiPriorityConfidence(0.99)
                .aiPredictedDepartment("Electricity & Public Lighting Department")
                .assignedDepartment(deptElectric)
                .assignedOfficer(officerElectric)
                .officialRemarks("Emergency electrical safety team dispatched immediately with bucket truck.")
                .slaDeadline(LocalDateTime.now().plusHours(4))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c3)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Emergency report submitted. AI detected Critical Electrical Hazard.")
                .updatedBy(citizenRahul)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c3)
                .status(ComplaintStatus.ASSIGNED)
                .remarks("Auto-escalated to Electrical Sub-Division Officer Karthik Raman.")
                .updatedBy(admin)
                .build());

        // Complaint 4: Resolved with Feedback
        Complaint c4 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000104")
                .citizen(citizenRahul)
                .title("Major drinking water pipeline leak flooding MG Road sidewalk")
                .description("Underground drinking water feeder pipe had fractured, leaking thousands of liters of clean water and eroding the sidewalk paver blocks.")
                .category(catWater)
                .priority(Priority.HIGH)
                .status(ComplaintStatus.RESOLVED)
                .address("MG Road, Near Trinity Circle")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Trinity Circle Junction")
                .pincode("560001")
                .latitude(12.9734)
                .longitude(77.6200)
                .aiClassification("Water Leakage & Pipeline Burst")
                .aiPriorityConfidence(0.95)
                .aiPredictedDepartment("Water Supply & Sewerage Board")
                .assignedDepartment(deptWater)
                .assignedOfficer(officerWater)
                .officialRemarks("Pipeline collar replaced with high-tensile clamp, pressure tested at 4.5 bar, and sidewalk pavers restored.")
                .resolutionNotes("Main valve isolated, defective 150mm ductile iron section replaced, full restoration completed within 14 hours.")
                .slaDeadline(LocalDateTime.now().minusHours(2))
                .resolvedAt(LocalDateTime.now().minusHours(4))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c4)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Reported by citizen.")
                .updatedBy(citizenRahul)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c4)
                .status(ComplaintStatus.ASSIGNED)
                .remarks("Assigned to Senior Hydraulic Engineer Mohan Das.")
                .updatedBy(admin)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c4)
                .status(ComplaintStatus.IN_PROGRESS)
                .remarks("Excavation and pipe replacement underway.")
                .updatedBy(officerWater)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c4)
                .status(ComplaintStatus.RESOLVED)
                .remarks("Pipe joint sealed, sidewalk restored, and water supply restored.")
                .updatedBy(officerWater)
                .build());

        // Feedback for c4
        feedbackRepository.save(ComplaintFeedback.builder()
                .complaint(c4)
                .citizen(citizenRahul)
                .rating(5)
                .comments("Prompt response by the municipal water board team! The leak was fixed and the footpath was neatly restored within a day.")
                .isSatisfied(true)
                .build());

        // Complaint 5: Under Review (Drainage)
        Complaint c5 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000105")
                .citizen(citizenPriya)
                .title("Monsoon stormwater drain choked with plastic causing street waterlogging")
                .description("The main roadside drain is choked with construction plastic and silt. Rainwater is overflowing into residential compound driveways.")
                .category(catDrain)
                .priority(Priority.MEDIUM)
                .status(ComplaintStatus.UNDER_REVIEW)
                .address("14th Main Road, HSR Layout Sector 1")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Opposite HSR Club")
                .pincode("560102")
                .latitude(12.9116)
                .longitude(77.6389)
                .aiClassification("Clogged Drains & Sewage Overflow")
                .aiPriorityConfidence(0.91)
                .aiPredictedDepartment("Drainage & Stormwater Department")
                .assignedDepartment(deptDrainage)
                .slaDeadline(LocalDateTime.now().plusHours(30))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c5)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint logged.")
                .updatedBy(citizenPriya)
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c5)
                .status(ComplaintStatus.UNDER_REVIEW)
                .remarks("Under technical evaluation for desilting equipment deployment.")
                .updatedBy(admin)
                .build());

        // Complaint 6: Solid Waste Department Pool (Submitted)
        Complaint c6 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000106")
                .citizen(citizenRahul)
                .title("Commercial garbage dump near City Market complex")
                .description("Commercial vegetable and packaging waste has piled up behind City Market shop block C.")
                .category(catGarbage)
                .priority(Priority.HIGH)
                .status(ComplaintStatus.SUBMITTED)
                .address("City Market East Gate, Gandhi Bazaar")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Behind Gate 3")
                .pincode("560002")
                .latitude(12.9602)
                .longitude(77.5750)
                .aiClassification("Garbage & Waste Accumulation")
                .aiPriorityConfidence(0.97)
                .aiPredictedDepartment("Solid Waste Management Department")
                .assignedDepartment(deptWaste)
                .slaDeadline(LocalDateTime.now().plusHours(16))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c6)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint registered for municipal waste disposal.")
                .updatedBy(citizenRahul)
                .build());

        // Complaint 7: Water Supply In Progress
        Complaint c7 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000107")
                .citizen(citizenPriya)
                .title("Low water pressure and suspected underground valve blockage on 7th Cross")
                .description("Residents of 7th Cross are experiencing zero water pressure in morning hours.")
                .category(catWater)
                .priority(Priority.MEDIUM)
                .status(ComplaintStatus.IN_PROGRESS)
                .address("7th Cross, Malleshwaram 15th Cross Link")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Near Sri Krishna Temple")
                .pincode("560003")
                .latitude(12.9984)
                .longitude(77.5712)
                .aiClassification("Water Leakage & Pipeline Burst")
                .aiPriorityConfidence(0.89)
                .aiPredictedDepartment("Water Supply & Sewerage Board")
                .assignedDepartment(deptWater)
                .assignedOfficer(officerWater)
                .officialRemarks("Pressure testing crew on site checking the distribution valve.")
                .slaDeadline(LocalDateTime.now().plusHours(22))
                .build());

        historyRepository.save(ComplaintStatusHistory.builder()
                .complaint(c7)
                .status(ComplaintStatus.ASSIGNED)
                .remarks("Assigned to Senior Hydraulic Engineer Mohan Das.")
                .updatedBy(admin)
                .build());

        // Complaint 8: Electrical Resolved
        Complaint c8 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000108")
                .citizen(citizenRahul)
                .title("Flickering LED streetlights across 3 consecutive poles on Ring Road")
                .description("Three LED streetlight luminaires were flickering continuously creating night driving hazard.")
                .category(catLight)
                .priority(Priority.LOW)
                .status(ComplaintStatus.RESOLVED)
                .address("Outer Ring Road, Near Bellandur Flyover")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Poles #104, 105, 106")
                .pincode("560103")
                .latitude(12.9288)
                .longitude(77.6744)
                .aiClassification("Broken Streetlights & Electrical Hazards")
                .aiPriorityConfidence(0.93)
                .aiPredictedDepartment("Electricity & Public Lighting Department")
                .assignedDepartment(deptElectric)
                .assignedOfficer(officerElectric)
                .officialRemarks("SMPS power drivers replaced on all 3 fixtures. Lux levels verified.")
                .resolutionNotes("Driver modules replaced under warranty; fully operational.")
                .resolvedAt(LocalDateTime.now().minusHours(12))
                .slaDeadline(LocalDateTime.now().plusHours(12))
                .build());

        // Complaint 9: Roads Resolved
        Complaint c9 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-000109")
                .citizen(citizenPriya)
                .title("Broken asphalt and deep ruts on residential lane indiranagar")
                .description("Asphalt surface was cracked and peeled away after utility trench digging.")
                .category(catPothole)
                .priority(Priority.MEDIUM)
                .status(ComplaintStatus.RESOLVED)
                .address("6th Main Road, Indiranagar 1st Stage")
                .municipality("Central City Municipal Corporation")
                .city("Metro City")
                .landmark("Opposite Defence Colony Park")
                .pincode("560038")
                .latitude(12.9810)
                .longitude(77.6430)
                .aiClassification("Potholes & Road Damage")
                .aiPriorityConfidence(0.92)
                .aiPredictedDepartment("Roads & Infrastructure Department")
                .assignedDepartment(deptRoads)
                .assignedOfficer(officerRoads)
                .officialRemarks("Patchwork hot asphalt compaction completed.")
                .resolutionNotes("Bituminous concrete layer laid and compacted smoothly.")
                .resolvedAt(LocalDateTime.now().minusDays(1))
                .slaDeadline(LocalDateTime.now().plusHours(8))
                .build());

        // Seed Sample Citizen Feedbacks for Resolved Complaints
        ComplaintFeedback fb8 = feedbackRepository.save(ComplaintFeedback.builder()
                .complaint(c8)
                .citizen(citizenRahul)
                .rating(5)
                .comments("Streetlights were fixed promptly on the same evening. Good work by the electrical crew.")
                .isSatisfied(true)
                .build());
        c8.setFeedback(fb8);
        complaintRepository.save(c8);

        ComplaintFeedback fb9 = feedbackRepository.save(ComplaintFeedback.builder()
                .complaint(c9)
                .citizen(citizenPriya)
                .rating(4)
                .comments("The asphalt patch is smooth and vehicles can pass safely now. Thanks.")
                .isSatisfied(true)
                .build());
        c9.setFeedback(fb9);
        complaintRepository.save(c9);

        // Seed Notifications
        notificationRepository.save(Notification.builder()
                .recipient(citizenRahul)
                .title("Complaint In Progress: CMP-2026-000101")
                .message("Roads department team has arrived on site to repair the pothole on 100ft Road.")
                .type("STATUS_CHANGE")
                .relatedComplaintId(c1.getId())
                .relatedComplaintNumber("CMP-2026-000101")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(citizenRahul)
                .title("Complaint Resolved: CMP-2026-000104")
                .message("Water pipeline repair at MG Road is complete. Thank you for your feedback!")
                .type("STATUS_CHANGE")
                .relatedComplaintId(c4.getId())
                .relatedComplaintNumber("CMP-2026-000104")
                .isRead(true)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(officerRoads)
                .title("Active Task: CMP-2026-000101")
                .message("High priority road defect assigned to you in Indiranagar zone.")
                .type("ASSIGNMENT")
                .relatedComplaintId(c1.getId())
                .relatedComplaintNumber("CMP-2026-000101")
                .isRead(false)
                .build());

        System.out.println(">>> Seed data initialized successfully!");
    }

    private void ensureGovernmentAccounts() {
        List<Department> depts = departmentRepository.findAll();
        Department deptRoads = depts.stream().filter(d -> d.getName().toLowerCase().contains("road") || (d.getCode() != null && d.getCode().contains("ROADS"))).findFirst().orElse(null);
        Department deptWaste = depts.stream().filter(d -> d.getName().toLowerCase().contains("waste") || d.getName().toLowerCase().contains("sanitat")).findFirst().orElse(null);
        Department deptWater = depts.stream().filter(d -> d.getName().toLowerCase().contains("water")).findFirst().orElse(null);
        Department deptElectric = depts.stream().filter(d -> d.getName().toLowerCase().contains("electr") || d.getName().toLowerCase().contains("light")).findFirst().orElse(null);

        String adminPass = System.getenv().getOrDefault("SEED_ADMIN_PASSWORD", "Admin@123");
        String headPass = System.getenv().getOrDefault("SEED_HEAD_PASSWORD", "Head@123");
        String officerPass = System.getenv().getOrDefault("SEED_OFFICER_PASSWORD", "Officer@123");
        String citizenPass = System.getenv().getOrDefault("SEED_CITIZEN_PASSWORD", "Citizen@123");

        // 1. Central Administration (@central.gov.in)
        upsertUser("commissioner@central.gov.in", "Municipal Commissioner Sharma", adminPass, Role.ROLE_ADMIN, null, "Chief Municipal Commissioner");
        upsertUser("admin@central.gov.in", "Central Administrator", adminPass, Role.ROLE_ADMIN, null, "Central Administration Officer");
        upsertUser("director@central.gov.in", "Director Administration Rao", adminPass, Role.ROLE_ADMIN, null, "Executive Director");

        // 2. Department Heads (username.departmentname@gov.in)
        if (deptRoads != null) {
            upsertUser("rajkumar.roads@gov.in", "Er. Rajkumar Verma", headPass, Role.ROLE_HEAD, deptRoads, "Chief Engineer & Department Head (Roads)");
            upsertUser("rajesh.roads@gov.in", "Er. Rajesh Verma", headPass, Role.ROLE_HEAD, deptRoads, "Chief Engineer (Roads)");
        }
        if (deptWaste != null) {
            upsertUser("kumar.waste@gov.in", "Dr. Kumar Waste Head", headPass, Role.ROLE_HEAD, deptWaste, "Chief Sanitation & Waste Management Head");
            upsertUser("suresh.waste@gov.in", "Dr. Suresh Waste Head", headPass, Role.ROLE_HEAD, deptWaste, "Chief Sanitation Officer");
        }
        if (deptWater != null) {
            upsertUser("suresh.water@gov.in", "Er. Suresh Water Head", headPass, Role.ROLE_HEAD, deptWater, "Chief Hydraulic Engineer & Water Board Head");
            upsertUser("anita.water@gov.in", "Dr. Anita Water Head", headPass, Role.ROLE_HEAD, deptWater, "Executive Engineer (Water Supply)");
        }
        if (deptElectric != null) {
            upsertUser("arun.electricity@gov.in", "Er. Arun Electricity Head", headPass, Role.ROLE_HEAD, deptElectric, "Chief Electrical Engineer & Lighting Head");
            upsertUser("priya.electricity@gov.in", "Er. Priya Electricity Head", headPass, Role.ROLE_HEAD, deptElectric, "Superintending Electrical Engineer");
        }

        // 3. Municipal Officials (username@municipality.gov.in)
        upsertUser("Nathisha@municipality.gov.in", "Nathisha Municipal Officer", officerPass, Role.ROLE_OFFICER, deptRoads, "Senior Executive Municipal Officer");
        upsertUser("nathisha@municipality.gov.in", "Nathisha Municipal Officer", officerPass, Role.ROLE_OFFICER, deptRoads, "Senior Executive Municipal Officer");
        upsertUser("rajkumar@municipality.gov.in", "Raj Kumar", officerPass, Role.ROLE_OFFICER, deptRoads, "Municipal Officer (Roads)");
        upsertUser("arun@municipality.gov.in", "Arun Sharma", officerPass, Role.ROLE_OFFICER, deptElectric, "Municipal Officer (Operations)");
        upsertUser("alok@municipality.gov.in", "Er. Alok Sharma", officerPass, Role.ROLE_OFFICER, deptRoads, "Senior Executive Road Engineer");
        upsertUser("ananya@municipality.gov.in", "Dr. Ananya Ray", officerPass, Role.ROLE_OFFICER, deptWaste, "Chief Sanitation Inspector");
        upsertUser("mohan@municipality.gov.in", "Er. Mohan Das", officerPass, Role.ROLE_OFFICER, deptWater, "Senior Hydraulic Engineer");
        upsertUser("karthik@municipality.gov.in", "Er. Karthik Raman", officerPass, Role.ROLE_OFFICER, deptElectric, "Electrical Sub-Division Officer");

        // 4. Citizens (Personal Email Addresses)
        upsertUser("rahul.verma@example.com", "Rahul Verma", citizenPass, Role.ROLE_CITIZEN, null, null);
        upsertUser("user@gmail.com", "Citizen User", citizenPass, Role.ROLE_CITIZEN, null, null);
        upsertUser("priya.deshmukh@example.com", "Priya Deshmukh", citizenPass, Role.ROLE_CITIZEN, null, null);
    }

    private void upsertUser(String email, String fullName, String rawPassword, Role role, Department dept, String designation) {
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            existing.setRole(role);
            if (dept != null) existing.setDepartment(dept);
            if (designation != null) existing.setDesignation(designation);
            existing.setMunicipality("Central City Municipal Corporation");
            existing.setCity("Metro City");
            existing.setState("Karnataka");
            existing.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(existing);
        } else {
            userRepository.save(User.builder()
                    .fullName(fullName)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .phoneNumber("9845012345")
                    .role(role)
                    .department(dept)
                    .designation(designation)
                    .municipality("Central City Municipal Corporation")
                    .city("Metro City")
                    .state("Karnataka")
                    .isActive(true)
                    .build());
        }
    }
}
