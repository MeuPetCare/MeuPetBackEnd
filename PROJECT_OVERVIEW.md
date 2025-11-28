# 🏥 MeuPet - Veterinary Clinic Management System

## **📋 Application Overview**

**MeuPet** is a comprehensive **veterinary clinic management system** built with **NestJS**, **TypeORM**, and **MySQL**. The application provides a complete digital solution for managing veterinary operations, from patient registration to medical records and appointment scheduling.

### **🎯 Purpose & Vision**
The system digitalizes traditional veterinary clinic workflows, enabling:
- **Efficient patient management** (animals and their owners)
- **Streamlined appointment scheduling**
- **Comprehensive medical record keeping**
- **Multi-role access control** (admins and veterinarians)
- **Complete audit trail** of medical procedures and exams

---

## **🏗️ System Architecture**

### **Technology Stack**
- **Backend Framework**: NestJS (Node.js with TypeScript)
- **Database**: MySQL with TypeORM ORM
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Deployment**: Railway.app (production) + Docker support

### **Security & Authentication**
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (Admin, Veterinarian)
- **Service tokens** for frontend applications
- **Password hashing** with bcrypt
- **Guard-protected endpoints** with role validation

---

## **🗃️ Database Structure & Entity Relationships**

### **Core Entities Overview**

```
📊 Database Schema:
User (System Users) ←→ Schedule (Appointments) ←→ Animal (Patients)
                              ↓                      ↑
                         MedicalRecord ←→ Procedure   ↑
                              ↓                      ↑
                             Exam ←←←←←←←←←←←←←←←←←←←↑
                              ↓                      ↑
                            Tutor (Pet Owners) ←←←←←↑
```

---

### **🙋‍♂️ User Entity** (`src/user/user.entity.ts`)
**Purpose**: System users (administrators and veterinarians)

**Fields**:
- `id`: Primary key
- `email`: Unique login identifier
- `passwordHash`: Encrypted password (excluded from responses)
- `fullName`: Full name of the user
- `phone`: Contact number
- `crmv`: Veterinary license number (unique for vets)
- `specialty`: Medical specialty (optional)
- `roles`: JSON array of user roles (`['admin']` or `['veterinarian']`)
- `isActive`: Account status flag

**Business Logic**:
- **Admins**: Full system access, user management, clinic administration
- **Veterinarians**: Patient care, medical records, appointments
- **Role-based permissions** control API access throughout the system

---

### **👨‍👩‍👧‍👦 Tutor Entity** (`src/tutor/tutor.entity.ts`)
**Purpose**: Pet owners/guardians

**Fields**:
- `id`: Primary key
- `name`: Full name
- `telephone`: Contact phone
- `email`: Unique email address
- `cpf`: Brazilian tax ID (unique)
- `address`: Physical address
- `animal`: One-to-many relationship with animals

**Business Logic**:
- **Central contact point** for all pets owned
- **Billing and communication** hub
- **Legal responsibility** for medical decisions

---

### **🐕 Animal Entity** (`src/animal/animal.entity.ts`)
**Purpose**: Veterinary patients

**Fields**:
- `id`: Primary key
- `name`: Pet's name
- `species`: Dog, cat, bird, etc.
- `breed`: Specific breed information
- `birthDate`: Date of birth for age calculation
- `weight`: Current weight (decimal precision)
- `gender`: Male/Female/Other
- `tutor`: Many-to-one relationship with tutor
- `tutorId`: Foreign key to tutor

**Business Logic**:
- **Primary patient records**
- **Medical history tracking**
- **Appointment scheduling subjects**
- **Cascading delete** when tutor is removed

---

### **📅 Schedule Entity** (`src/schedule/schedule.entity.ts`)
**Purpose**: Appointment scheduling and management

**Fields**:
- `id`: Primary key
- `dateHour`: Appointment date and time
- `reason`: Medical reason for visit
- `status`: Current status ('Agendada', 'Confirmada', 'Cancelada', etc.)
- `animal`: Many-to-one relationship with patient
- `veterinarian`: Many-to-one relationship with assigned vet
- `medicalRecord`: One-to-one relationship (when appointment is completed)

**Business Logic**:
- **Calendar management** for clinic operations
- **Resource allocation** (veterinarian time slots)
- **Appointment lifecycle tracking**
- **Integration point** between scheduling and medical care

---

### **📋 MedicalRecord Entity** (`src/medicalRecord/medicalRecord.entity.ts`)
**Purpose**: Complete medical consultation records

**Fields**:
- `id`: Primary key
- `schedule`: One-to-one relationship with appointment
- `scheduleId`: Unique foreign key to schedule
- `anamnesis`: Patient history and symptoms
- `diagnosis`: Medical diagnosis
- `treatment`: Prescribed treatment plan
- `veterinarian`: Many-to-one relationship with attending vet
- `procedures`: One-to-many relationship with performed procedures
- `dateMedicalRecord`: Timestamp of record creation

**Business Logic**:
- **Complete medical documentation**
- **Legal medical records**
- **Treatment history tracking**
- **Foundation for follow-up care**

---

### **⚕️ Procedure Entity** (`src/procedure/procedure.entity.ts`)
**Purpose**: Medical procedures performed during consultations

**Fields**:
- `id`: Primary key
- `name`: Procedure name (vaccination, surgery, etc.)
- `observations`: Additional notes
- `cost`: Decimal cost for billing
- `medicalRecord`: Many-to-one relationship with medical record

**Business Logic**:
- **Detailed procedure tracking**
- **Cost calculation** for billing
- **Medical procedure history**
- **Audit trail** for performed treatments

---

### **🔬 Exam Entity** (`src/exam/exam.entity.ts`)
**Purpose**: Laboratory tests and diagnostic examinations

**Fields**:
- `id`: Primary key
- `name`: Type of examination
- `requestDate`: When exam was requested
- `resultDate`: When results became available
- `status`: Current status ('Solicitado', 'Em Andamento', 'Finalizado')
- `result`: Textual examination results
- `resultUrlUrl`: Digital report attachment URL (future MinIO/S3 integration)
- `animal`: Many-to-one relationship with patient
- `veterinarian`: Many-to-one relationship with requesting vet

**Business Logic**:
- **Diagnostic workflow management**
- **Lab integration ready** (digital reports)
- **Result tracking and notification**
- **Historical diagnostic data**

---

## **🔐 Security & Access Control**

### **Authentication System**
Located in `src/auth/`:

**Components**:
- **JWT Strategy**: Token validation and user extraction
- **Local Strategy**: Email/password authentication
- **Guards**: Route protection (`JwtAuthGuard`, `RolesGuard`)
- **Decorators**: Role-based access control (`@Roles()`)
- **Service Tokens**: Special tokens for frontend applications

**Access Levels**:
```typescript
Admin Access:
- User management (create/edit/delete users)
- Complete system access
- Service token generation
- Data export and reports

Veterinarian Access:
- Patient management (animals, tutors)
- Medical records (create/edit/view)
- Appointment scheduling
- Exam requests and results
```

---

## **📊 API Structure & Business Flows**

### **Core API Modules**

**1. User Management** (`/users`)
- Admin creation and veterinarian registration
- User profile management
- Password updates and account control

**2. Patient Management** (`/tutor`, `/animal`)
- Tutor registration and contact management
- Animal registration with complete medical profiles
- Patient history tracking

**3. Appointment System** (`/schedule`)
- Appointment scheduling and calendar management
- Status tracking and cancellations
- Veterinarian assignment

**4. Medical Care** (`/medicalRecord`, `/procedure`)
- Medical record creation and management
- Procedure documentation and billing
- Treatment plan tracking

**5. Diagnostics** (`/exam`)
- Examination requests and workflow
- Result management and reporting
- Digital report integration (planned)

**6. Authentication** (`/auth`)
- User login and token management
- Service token generation for frontends
- Role-based access validation

---

## **🚀 Deployment & Environment Configuration**

### **Environment Separation**
- **Development**: Local MySQL with hot reload and SQL logging
- **Production**: Railway MySQL with SSL, connection pooling
- **Testing**: Isolated test database for CI/CD

### **Production Features**
- **Multi-stage Docker builds** for optimization
- **Health checks** for container monitoring
- **Environment-based database configuration**
- **Automatic Railway deployment** with MySQL service integration

### **Environment Variables**

#### **Development**
```bash
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
DATABASE_NAME=MeuPet
JWT_SECRET=dev-secret-key
```

#### **Production (Railway)**
```bash
NODE_ENV=production
# Railway auto-provides:
# MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
JWT_SECRET=your-production-secret
```

---

## **🔮 Key Features & Capabilities**

### **Current Implementation**
✅ **Complete CRUD operations** for all entities  
✅ **Role-based access control** with JWT authentication  
✅ **Swagger API documentation** with interactive testing  
✅ **Validation and error handling** with detailed messages  
✅ **Database relationships** with proper cascading  
✅ **Service token system** for frontend integration  
✅ **Production-ready deployment** configuration  

### **Architectural Strengths**
🏗️ **Modular design** - Each entity has its own module (controller, service, entity, DTOs)  
🛡️ **Security-first approach** - All endpoints protected with appropriate role guards  
📝 **Documentation-driven** - Comprehensive Swagger documentation  
🔧 **Environment-aware** - Proper dev/prod separation  
🧪 **Testing-ready** - Jest configuration and test structure in place  

---

## **📁 Project Structure**

```
src/
├── auth/                    # Authentication & Authorization
│   ├── guards/             # JWT & Role guards
│   ├── strategies/         # Passport strategies
│   ├── dto/               # Auth DTOs (login, service tokens)
│   └── decorators/        # Role decorators
├── user/                   # System users (admins, vets)
├── tutor/                  # Pet owners
├── animal/                 # Veterinary patients
├── schedule/               # Appointment scheduling
├── medicalRecord/          # Medical consultation records
├── procedure/              # Medical procedures
├── exam/                   # Laboratory tests & diagnostics
├── config/                 # Configuration files
│   └── database.config.ts  # Environment-aware DB config
└── main.ts                 # Application bootstrap

docker/
├── Dockerfile              # Production container
├── Dockerfile.dev          # Development container
├── docker-compose.yml      # Production compose
└── docker-compose.dev.yml  # Development compose

config/
├── .env.development        # Dev environment variables
├── .env.production         # Prod environment template
├── railway.json           # Railway deployment config
└── DEPLOYMENT.md          # Deployment guide
```

---

## **🔄 Typical Workflow Example**

### **Complete Patient Care Cycle**

1. **Patient Registration**
   ```
   POST /tutor → Create pet owner
   POST /animal → Register pet with tutor relationship
   ```

2. **Appointment Scheduling**
   ```
   POST /schedule → Book appointment (animal + veterinarian + datetime)
   GET /schedule → View clinic calendar
   ```

3. **Medical Consultation**
   ```
   POST /medicalRecord → Create medical record linked to schedule
   POST /procedure → Add performed procedures to record
   POST /exam → Request laboratory tests
   ```

4. **Follow-up Care**
   ```
   GET /animal/:id/history → Review complete medical history
   PATCH /exam/:id → Update examination results
   POST /schedule → Book follow-up appointments
   ```

---

## **🛡️ Security Best Practices**

### **Implemented Security Measures**
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token generation and validation
- **Role-based Access**: Granular permission control
- **Input Validation**: class-validator for all DTOs
- **SQL Injection Protection**: TypeORM query builder
- **CORS Configuration**: Proper cross-origin setup
- **Environment Secrets**: Secure environment variable management

### **Production Security Checklist**
- [x] Strong JWT secrets in production
- [x] Database connection with SSL (Railway)
- [x] Password complexity requirements
- [x] Role-based endpoint protection
- [x] Input sanitization and validation
- [x] Error handling without information leakage
- [x] Health check endpoints for monitoring

---

## **💡 Business Value**

This system provides a **complete digital transformation** for veterinary clinics by:

1. **Centralizing patient information** - Complete animal and owner profiles
2. **Streamlining workflows** - From scheduling to medical records
3. **Ensuring compliance** - Proper medical record keeping
4. **Improving efficiency** - Role-based access and automated processes
5. **Enabling growth** - Scalable architecture ready for additional features
6. **Supporting integration** - Service tokens and API-first design for frontend applications

The codebase represents a **production-ready veterinary management system** with proper separation of concerns, security implementation, and deployment configuration suitable for real-world clinic operations.

---

## **🚀 Getting Started**

### **Development Setup**
```bash
# Clone and install dependencies
npm install

# Start development environment with Docker
docker-compose -f docker-compose.dev.yml up --build

# Or run locally
cp .env.development .env
npm run start:dev

# Access API documentation
http://localhost:3000/docs
```

### **Production Deployment**
See `DEPLOYMENT.md` for complete Railway deployment guide.

---

## **📚 Additional Resources**

- **API Documentation**: Available at `/docs` endpoint
- **Deployment Guide**: `DEPLOYMENT.md`
- **Environment Setup**: `.env.example`
- **Docker Configuration**: `docker-compose*.yml` files

---

*This documentation provides a comprehensive overview of the MeuPet veterinary management system. For specific implementation details, refer to the source code and inline comments.*