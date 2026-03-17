# Loan Approval Prediction System - Project Diagrams

## 1. DFD Level 0 (Context Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌──────────┐         Loan Application Data          ┌──────────────────┐
│    │          │ ─────────────────────────────────────► │                  │
│    │   User   │                                        │   Loan Approval  │
│    │  (Loan   │                                        │    Prediction    │
│    │ Officer) │ ◄───────────────────────────────────── │      System      │
│    │          │      Prediction Result (Approved/      │                  │
│    └──────────┘           Rejected + Confidence)       └──────────────────┘
│                                                                 │
│                                                                 │
│    ┌──────────┐         Analytics Request              ┌──────────────────┐
│    │          │ ─────────────────────────────────────► │                  │
│    │  Admin/  │                                        │   Loan Approval  │
│    │ Analyst  │ ◄───────────────────────────────────── │    Prediction    │
│    │          │      Reports, Charts, Model Metrics    │      System      │
│    └──────────┘                                        └──────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### DFD Level 0 - Mermaid Version
```mermaid
flowchart LR
    User((User/Loan Officer)) -->|Loan Application Data| System[Loan Approval Prediction System]
    System -->|Prediction Result| User
    Admin((Admin/Analyst)) -->|Analytics Request| System
    System -->|Reports & Metrics| Admin
    System <-->|Store/Retrieve| DB[(Database)]
```

---

## 2. DFD Level 1 (Detailed Data Flow)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│  ┌────────┐                                                                    │
│  │  User  │                                                                    │
│  └───┬────┘                                                                    │
│      │                                                                         │
│      │ Applicant Details                                                       │
│      ▼                                                                         │
│  ┌─────────────────┐      Processed Data     ┌─────────────────┐              │
│  │  1.0            │ ───────────────────────►│  2.0            │              │
│  │  Input          │                         │  Feature        │              │
│  │  Validation     │                         │  Engineering    │              │
│  └─────────────────┘                         └────────┬────────┘              │
│                                                       │                        │
│                                                       │ Engineered Features    │
│                                                       ▼                        │
│                                              ┌─────────────────┐              │
│  ┌─────────────────┐    Prediction Result    │  3.0            │              │
│  │  4.0            │◄────────────────────────│  ML Prediction  │              │
│  │  Result         │                         │  Engine         │              │
│  │  Processing     │                         └────────┬────────┘              │
│  └────────┬────────┘                                  │                        │
│           │                                           │ Save Prediction        │
│           │ Display Result                            ▼                        │
│           ▼                                  ┌─────────────────┐              │
│      ┌────────┐                              │  D1             │              │
│      │  User  │                              │  Predictions    │              │
│      └────────┘                              │  Database       │              │
│                                              └─────────────────┘              │
│                                                       │                        │
│  ┌────────┐          Analytics Data                   │                        │
│  │ Admin  │◄──────────────────────────────────────────┘                        │
│  └────────┘                                                                    │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### DFD Level 1 - Mermaid Version
```mermaid
flowchart TD
    User((User)) -->|Applicant Details| P1[1.0 Input Validation]
    P1 -->|Validated Data| P2[2.0 Feature Engineering]
    P2 -->|Engineered Features| P3[3.0 ML Prediction Engine]
    P3 -->|Prediction| P4[4.0 Result Processing]
    P4 -->|Display Result| User
    P3 -->|Store| D1[(D1: Predictions DB)]
    D1 -->|Retrieve History| P5[5.0 Analytics Processing]
    P5 -->|Reports & Charts| Admin((Admin))
    D1 -->|History Data| P4
```

---

## 3. ER Diagram (Entity Relationship)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐               │
│  │     PREDICTION      │         │    MODEL_METRICS    │               │
│  ├─────────────────────┤         ├─────────────────────┤               │
│  │ PK  id (UUID)       │         │ PK  model_name      │               │
│  │     gender          │         │     accuracy        │               │
│  │     married         │         │     training_date   │               │
│  │     dependents      │         │     sample_size     │               │
│  │     education       │         └─────────────────────┘               │
│  │     self_employed   │                                               │
│  │     applicant_income│         ┌─────────────────────┐               │
│  │     coapplicant_inc │         │   PROPERTY_AREA     │               │
│  │     loan_amount     │         ├─────────────────────┤               │
│  │     loan_term       │         │ PK  area_type       │               │
│  │     credit_history  │         │     description     │               │
│  │ FK  property_area   │─────────│                     │               │
│  │     prediction      │         └─────────────────────┘               │
│  │     confidence      │                                               │
│  │     approved (bool) │         ┌─────────────────────┐               │
│  │     timestamp       │         │    EDUCATION_TYPE   │               │
│  └─────────────────────┘         ├─────────────────────┤               │
│                                  │ PK  education_type  │               │
│                                  │     description     │               │
│                                  └─────────────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### ER Diagram - Mermaid Version
```mermaid
erDiagram
    PREDICTION {
        uuid id PK
        string gender
        string married
        string dependents
        string education
        string self_employed
        float applicant_income
        float coapplicant_income
        float loan_amount
        float loan_term
        int credit_history
        string property_area
        string prediction
        float confidence
        boolean approved
        datetime timestamp
    }
    
    MODEL_METRICS {
        string model_name PK
        float accuracy
        datetime training_date
        int sample_size
    }
    
    PROPERTY_AREA {
        string area_type PK
        string description
    }
    
    PREDICTION }|--|| PROPERTY_AREA : "located_in"
```

---

## 4. Gantt Chart (Project Timeline)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    LOAN PREDICTION SYSTEM - PROJECT TIMELINE                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Task                          │ Week 1 │ Week 2 │ Week 3 │ Week 4 │ Week 5 │     │
├───────────────────────────────┼────────┼────────┼────────┼────────┼────────┤     │
│ Requirements Analysis         │████████│        │        │        │        │     │
│ Data Collection & Cleaning    │████████│████████│        │        │        │     │
│ EDA & Feature Engineering     │        │████████│████████│        │        │     │
│ Model Training & Selection    │        │        │████████│████████│        │     │
│ Backend API Development       │        │        │████████│████████│        │     │
│ Frontend UI Development       │        │        │        │████████│████████│     │
│ Integration & Testing         │        │        │        │████████│████████│     │
│ Documentation                 │        │        │        │        │████████│     │
│ Deployment                    │        │        │        │        │████████│     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Gantt Chart - Mermaid Version
```mermaid
gantt
    title Loan Prediction System - Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Analysis       :done, req, 2026-01-01, 7d
    Data Collection            :done, data, 2026-01-01, 14d
    section Development
    EDA & Feature Engineering  :done, eda, 2026-01-08, 14d
    Model Training & Selection :done, model, 2026-01-15, 14d
    Backend API Development    :done, backend, 2026-01-15, 14d
    Frontend UI Development    :done, frontend, 2026-01-22, 14d
    section Testing & Deployment
    Integration Testing        :done, test, 2026-01-22, 14d
    Documentation              :done, docs, 2026-01-29, 7d
    Deployment                 :done, deploy, 2026-01-29, 7d
```

---

## 5. PERT Chart (Program Evaluation and Review Technique)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                              PERT CHART                                            │
│                                                                                    │
│    ┌───┐      ┌───┐      ┌───┐      ┌───┐      ┌───┐      ┌───┐      ┌───┐       │
│    │ 1 │─────►│ 2 │─────►│ 3 │─────►│ 4 │─────►│ 5 │─────►│ 6 │─────►│ 7 │       │
│    └───┘      └───┘      └───┘      └───┘      └───┘      └───┘      └───┘       │
│   START       Data        EDA       Model     Backend    Frontend    END         │
│              Collect    Analysis   Training     API         UI                    │
│                │                      │          │                                │
│                │          3d          │    7d    │    7d                          │
│                └──────────────────────┴──────────┴────────────────────────────    │
│                                                                                    │
│    Critical Path: 1 → 2 → 3 → 4 → 5 → 6 → 7                                       │
│    Total Duration: 35 days                                                         │
│                                                                                    │
│    Node Details:                                                                   │
│    ┌─────┬────────────────────────┬──────────┬──────────┐                         │
│    │Node │ Activity               │ Duration │ Slack    │                         │
│    ├─────┼────────────────────────┼──────────┼──────────┤                         │
│    │  1  │ Project Start          │    0d    │    0     │                         │
│    │  2  │ Data Collection        │    7d    │    0     │                         │
│    │  3  │ EDA & Feature Eng.     │    7d    │    0     │                         │
│    │  4  │ Model Training         │    7d    │    0     │                         │
│    │  5  │ Backend Development    │    7d    │    0     │                         │
│    │  6  │ Frontend Development   │    7d    │    0     │                         │
│    │  7  │ Project End            │    0d    │    0     │                         │
│    └─────┴────────────────────────┴──────────┴──────────┘                         │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### PERT Chart - Mermaid Version
```mermaid
flowchart LR
    S((Start)) -->|0d| A[Data Collection<br/>7 days]
    A -->|7d| B[EDA & Feature<br/>Engineering<br/>7 days]
    B -->|14d| C[Model Training<br/>& Selection<br/>7 days]
    C -->|21d| D[Backend API<br/>Development<br/>7 days]
    D -->|28d| E[Frontend UI<br/>Development<br/>7 days]
    E -->|35d| F((End))
    
    style S fill:#90EE90
    style F fill:#90EE90
    style A fill:#FFD700
    style B fill:#FFD700
    style C fill:#FFD700
    style D fill:#FFD700
    style E fill:#FFD700
```

---

## 6. Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLASS DIAGRAM                                       │
│                                                                                  │
│  ┌──────────────────────────┐       ┌──────────────────────────┐               │
│  │    PredictionInput       │       │    PredictionResult      │               │
│  ├──────────────────────────┤       ├──────────────────────────┤               │
│  │ - gender: str            │       │ - id: UUID               │               │
│  │ - married: str           │       │ - input_data: dict       │               │
│  │ - dependents: str        │       │ - prediction: str        │               │
│  │ - education: str         │       │ - confidence: float      │               │
│  │ - self_employed: str     │       │ - timestamp: datetime    │               │
│  │ - applicant_income: float│       │ - approved: bool         │               │
│  │ - coapplicant_income:float       ├──────────────────────────┤               │
│  │ - loan_amount: float     │       │ + to_dict(): dict        │               │
│  │ - loan_amount_term: float│       │ + save(): void           │               │
│  │ - credit_history: int    │       └──────────────────────────┘               │
│  │ - property_area: str     │                    ▲                              │
│  ├──────────────────────────┤                    │ creates                      │
│  │ + validate(): bool       │                    │                              │
│  │ + to_features(): array   │       ┌──────────────────────────┐               │
│  └──────────────────────────┘       │    MLPredictor           │               │
│               │                      ├──────────────────────────┤               │
│               │ uses                 │ - model: RandomForest    │               │
│               ▼                      │ - feature_names: list    │               │
│  ┌──────────────────────────┐       │ - model_scores: dict     │               │
│  │   FeatureEngineering     │       ├──────────────────────────┤               │
│  ├──────────────────────────┤       │ + predict(input): Result │               │
│  │ - log_transform(): float │       │ + get_confidence(): float│               │
│  │ - one_hot_encode(): array│       │ + train(data): void      │               │
│  │ + prepare_features():arr │       └──────────────────────────┘               │
│  └──────────────────────────┘                    │                              │
│                                                  │ uses                         │
│  ┌──────────────────────────┐                    ▼                              │
│  │    AnalyticsService      │       ┌──────────────────────────┐               │
│  ├──────────────────────────┤       │      Database            │               │
│  │ - predictions: list      │       ├──────────────────────────┤               │
│  ├──────────────────────────┤       │ - connection: MongoDB    │               │
│  │ + get_stats(): dict      │◄──────│ - db_name: str           │               │
│  │ + get_by_property(): dict│       ├──────────────────────────┤               │
│  │ + get_by_education():dict│       │ + insert(doc): void      │               │
│  └──────────────────────────┘       │ + find(query): list      │               │
│                                     │ + delete(id): void       │               │
│                                     └──────────────────────────┘               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Class Diagram - Mermaid Version
```mermaid
classDiagram
    class PredictionInput {
        -string gender
        -string married
        -string dependents
        -string education
        -string self_employed
        -float applicant_income
        -float coapplicant_income
        -float loan_amount
        -float loan_amount_term
        -int credit_history
        -string property_area
        +validate() bool
        +to_features() array
    }
    
    class PredictionResult {
        -UUID id
        -dict input_data
        -string prediction
        -float confidence
        -datetime timestamp
        -bool approved
        +to_dict() dict
        +save() void
    }
    
    class MLPredictor {
        -RandomForest model
        -list feature_names
        -dict model_scores
        +predict(input) PredictionResult
        +get_confidence() float
        +train(data) void
    }
    
    class FeatureEngineering {
        +log_transform(value) float
        +one_hot_encode(category) array
        +prepare_features(input) array
    }
    
    class Database {
        -MongoDB connection
        -string db_name
        +insert(doc) void
        +find(query) list
        +delete(id) void
    }
    
    class AnalyticsService {
        -list predictions
        +get_stats() dict
        +get_by_property() dict
        +get_by_education() dict
    }
    
    PredictionInput --> FeatureEngineering : uses
    MLPredictor --> PredictionResult : creates
    MLPredictor --> Database : uses
    AnalyticsService --> Database : queries
```

---

## 7. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USE CASE DIAGRAM                                    │
│                                                                                  │
│                    ┌─────────────────────────────────────┐                      │
│                    │     Loan Prediction System          │                      │
│                    │                                     │                      │
│    ┌─────┐         │    ┌─────────────────────┐         │                      │
│    │     │         │    │  Submit Loan        │         │                      │
│    │     │─────────┼───►│  Application        │         │                      │
│    │     │         │    └─────────────────────┘         │                      │
│    │     │         │              │                      │                      │
│    │     │         │              │ «include»            │                      │
│    │     │         │              ▼                      │                      │
│    │ L   │         │    ┌─────────────────────┐         │                      │
│    │ o   │         │    │  View Prediction    │         │                      │
│    │ a   │─────────┼───►│  Result             │         │                      │
│    │ n   │         │    └─────────────────────┘         │                      │
│    │     │         │                                     │                      │
│    │ O   │         │    ┌─────────────────────┐         │                      │
│    │ f   │─────────┼───►│  View Prediction    │         │                      │
│    │ f   │         │    │  History            │         │                      │
│    │ i   │         │    └─────────────────────┘         │                      │
│    │ c   │         │                                     │                      │
│    │ e   │         │    ┌─────────────────────┐         │                      │
│    │ r   │─────────┼───►│  Delete Prediction  │         │                      │
│    │     │         │    └─────────────────────┘         │                      │
│    └─────┘         │                                     │         ┌─────┐     │
│                    │    ┌─────────────────────┐         │         │     │     │
│                    │    │  View Analytics     │◄────────┼─────────│     │     │
│                    │    │  Dashboard          │         │         │  A  │     │
│                    │    └─────────────────────┘         │         │  d  │     │
│                    │                                     │         │  m  │     │
│                    │    ┌─────────────────────┐         │         │  i  │     │
│                    │    │  View Model         │◄────────┼─────────│  n  │     │
│                    │    │  Performance        │         │         │     │     │
│                    │    └─────────────────────┘         │         │     │     │
│                    │                                     │         │     │     │
│                    │    ┌─────────────────────┐         │         │     │     │
│                    │    │  Export Reports     │◄────────┼─────────│     │     │
│                    │    └─────────────────────┘         │         └─────┘     │
│                    │                                     │                      │
│                    └─────────────────────────────────────┘                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Use Case Diagram - Mermaid Version
```mermaid
flowchart LR
    subgraph Actors
        LO[👤 Loan Officer]
        AD[👤 Admin/Analyst]
    end
    
    subgraph System[Loan Prediction System]
        UC1((Submit Loan<br/>Application))
        UC2((View Prediction<br/>Result))
        UC3((View Prediction<br/>History))
        UC4((Delete<br/>Prediction))
        UC5((View Analytics<br/>Dashboard))
        UC6((View Model<br/>Performance))
        UC7((Export<br/>Reports))
    end
    
    LO --> UC1
    LO --> UC2
    LO --> UC3
    LO --> UC4
    
    AD --> UC5
    AD --> UC6
    AD --> UC7
    AD --> UC3
    
    UC1 -.->|include| UC2
```

---

## 8. Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SEQUENCE DIAGRAM - Loan Prediction Flow                    │
│                                                                                      │
│   User          Frontend         Backend API        ML Model        Database         │
│    │               │                 │                 │               │             │
│    │  Fill Form    │                 │                 │               │             │
│    │──────────────►│                 │                 │               │             │
│    │               │                 │                 │               │             │
│    │               │  POST /predict  │                 │               │             │
│    │               │────────────────►│                 │               │             │
│    │               │                 │                 │               │             │
│    │               │                 │  Validate Input │               │             │
│    │               │                 │────────┐        │               │             │
│    │               │                 │        │        │               │             │
│    │               │                 │◄───────┘        │               │             │
│    │               │                 │                 │               │             │
│    │               │                 │ prepare_features│               │             │
│    │               │                 │────────────────►│               │             │
│    │               │                 │                 │               │             │
│    │               │                 │                 │  Transform    │             │
│    │               │                 │                 │───────┐       │             │
│    │               │                 │                 │       │       │             │
│    │               │                 │                 │◄──────┘       │             │
│    │               │                 │                 │               │             │
│    │               │                 │     predict()   │               │             │
│    │               │                 │────────────────►│               │             │
│    │               │                 │                 │               │             │
│    │               │                 │  prediction +   │               │             │
│    │               │                 │  confidence     │               │             │
│    │               │                 │◄────────────────│               │             │
│    │               │                 │                 │               │             │
│    │               │                 │            save_prediction      │             │
│    │               │                 │────────────────────────────────►│             │
│    │               │                 │                 │               │             │
│    │               │                 │                 │    saved      │             │
│    │               │                 │◄────────────────────────────────│             │
│    │               │                 │                 │               │             │
│    │               │  JSON Response  │                 │               │             │
│    │               │◄────────────────│                 │               │             │
│    │               │                 │                 │               │             │
│    │ Display Result│                 │                 │               │             │
│    │◄──────────────│                 │                 │               │             │
│    │               │                 │                 │               │             │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Sequence Diagram - Mermaid Version
```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant API as Backend API (FastAPI)
    participant ML as ML Predictor
    participant DB as MongoDB
    
    User->>FE: Fill loan application form
    FE->>API: POST /api/predict (loan data)
    API->>API: Validate input data
    API->>ML: prepare_features(input)
    ML->>ML: Log transform & One-hot encode
    ML-->>API: feature_array
    API->>ML: predict(features)
    ML->>ML: RandomForest.predict()
    ML-->>API: prediction + confidence
    API->>DB: Insert prediction record
    DB-->>API: Confirmation
    API-->>FE: JSON Response (result)
    FE-->>User: Display Approved/Rejected
```

---

## 9. Activity Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ACTIVITY DIAGRAM                                    │
│                                                                                  │
│                              ┌───────┐                                          │
│                              │ Start │                                          │
│                              └───┬───┘                                          │
│                                  │                                               │
│                                  ▼                                               │
│                         ┌───────────────┐                                       │
│                         │  User Opens   │                                       │
│                         │  Application  │                                       │
│                         └───────┬───────┘                                       │
│                                 │                                                │
│                                 ▼                                                │
│                         ┌───────────────┐                                       │
│                         │ Navigate to   │                                       │
│                         │ Predict Page  │                                       │
│                         └───────┬───────┘                                       │
│                                 │                                                │
│                                 ▼                                                │
│                         ┌───────────────┐                                       │
│                         │  Fill Loan    │                                       │
│                         │  Details Form │                                       │
│                         └───────┬───────┘                                       │
│                                 │                                                │
│                                 ▼                                                │
│                         ┌───────────────┐                                       │
│                         │ Submit Form   │                                       │
│                         └───────┬───────┘                                       │
│                                 │                                                │
│                                 ▼                                                │
│                        ◆───────────────◆                                        │
│                       ╱  Valid Input?   ╲                                       │
│                      ╱                   ╲                                      │
│                     ◆                     ◆                                     │
│                    Yes                    No                                    │
│                     │                      │                                    │
│                     ▼                      ▼                                    │
│            ┌───────────────┐      ┌───────────────┐                            │
│            │   Process     │      │ Show Error    │                            │
│            │   Features    │      │ Message       │                            │
│            └───────┬───────┘      └───────┬───────┘                            │
│                    │                      │                                     │
│                    ▼                      │                                     │
│            ┌───────────────┐              │                                     │
│            │  ML Model     │              │                                     │
│            │  Prediction   │              │                                     │
│            └───────┬───────┘              │                                     │
│                    │                      │                                     │
│                    ▼                      │                                     │
│            ┌───────────────┐              │                                     │
│            │ Save to DB    │              │                                     │
│            └───────┬───────┘              │                                     │
│                    │                      │                                     │
│                    ▼                      │                                     │
│           ◆───────────────◆              │                                     │
│          ╱   Approved?     ╲             │                                     │
│         ╱                   ╲            │                                     │
│        ◆                     ◆           │                                     │
│       Yes                    No          │                                     │
│        │                      │          │                                     │
│        ▼                      ▼          │                                     │
│ ┌─────────────┐      ┌─────────────┐     │                                     │
│ │Display      │      │Display      │     │                                     │
│ │APPROVED     │      │REJECTED     │     │                                     │
│ │(Green)      │      │(Red)        │     │                                     │
│ └──────┬──────┘      └──────┬──────┘     │                                     │
│        │                    │            │                                     │
│        └────────┬───────────┘            │                                     │
│                 │                        │                                     │
│                 ▼◄───────────────────────┘                                     │
│          ┌───────────────┐                                                      │
│          │  End / New    │                                                      │
│          │  Prediction?  │                                                      │
│          └───────────────┘                                                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Activity Diagram - Mermaid Version
```mermaid
flowchart TD
    A([Start]) --> B[User Opens Application]
    B --> C[Navigate to Predict Page]
    C --> D[Fill Loan Details Form]
    D --> E[Submit Form]
    E --> F{Valid Input?}
    F -->|No| G[Show Error Message]
    G --> D
    F -->|Yes| H[Process Features]
    H --> I[ML Model Prediction]
    I --> J[Save to Database]
    J --> K{Approved?}
    K -->|Yes| L[Display APPROVED<br/>Green Badge]
    K -->|No| M[Display REJECTED<br/>Red Badge]
    L --> N{New Prediction?}
    M --> N
    N -->|Yes| C
    N -->|No| O([End])
```

---

## 10. Block Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM BLOCK DIAGRAM                                    │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FRONTEND (React)                                │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │   │
│  │  │  Dashboard   │ │  Prediction  │ │   History    │ │  Analytics   │       │   │
│  │  │    Page      │ │    Form      │ │    Page      │ │    Page      │       │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │   │
│  │                                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────────────────┐   │   │
│  │  │                         UI Components (Shadcn)                        │   │   │
│  │  │    Cards  │  Forms  │  Tables  │  Charts (Recharts)  │  Buttons      │   │   │
│  │  └──────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                             │
│                                       │ HTTP/REST API                               │
│                                       ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              BACKEND (FastAPI)                               │   │
│  │                                                                              │   │
│  │  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │   │
│  │  │  API Routes    │    │  Feature       │    │   ML Models    │            │   │
│  │  │  /api/predict  │───►│  Engineering   │───►│  RandomForest  │            │   │
│  │  │  /api/history  │    │  Module        │    │  Logistic Reg  │            │   │
│  │  │  /api/analytics│    │                │    │  DecisionTree  │            │   │
│  │  │  /api/metrics  │    │  - Log Trans   │    │  GradBoost     │            │   │
│  │  └────────────────┘    │  - One-Hot     │    └────────────────┘            │   │
│  │                        └────────────────┘                                    │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                             │
│                                       │ PyMongo Driver                              │
│                                       ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              DATABASE (MongoDB)                              │   │
│  │                                                                              │   │
│  │  ┌────────────────┐    ┌────────────────┐                                   │   │
│  │  │  predictions   │    │  model_metrics │                                   │   │
│  │  │  collection    │    │  collection    │                                   │   │
│  │  └────────────────┘    └────────────────┘                                   │   │
│  │                                                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE DIAGRAM                                   │
│                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                            CLIENT LAYER                                      │   │
│   │                                                                              │   │
│   │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │   │
│   │    │   Desktop    │    │   Mobile     │    │   Tablet     │                │   │
│   │    │   Browser    │    │   Browser    │    │   Browser    │                │   │
│   │    └──────────────┘    └──────────────┘    └──────────────┘                │   │
│   │                                                                              │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                              │
│                                       │ HTTPS                                        │
│                                       ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                         PRESENTATION LAYER                                   │   │
│   │                                                                              │   │
│   │   ┌─────────────────────────────────────────────────────────────────────┐   │   │
│   │   │                    React.js Frontend (Port 3000)                     │   │   │
│   │   │                                                                      │   │   │
│   │   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │   │
│   │   │  │Dashboard│  │ Predict │  │ History │  │Analytics│  │  Layout │  │   │   │
│   │   │  │  .jsx   │  │  .jsx   │  │  .jsx   │  │  .jsx   │  │  .jsx   │  │   │   │
│   │   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │   │   │
│   │   │                                                                      │   │   │
│   │   │  ┌─────────────────────────────────────────────────────────────┐    │   │   │
│   │   │  │              Shadcn UI Components + Tailwind CSS             │    │   │   │
│   │   │  └─────────────────────────────────────────────────────────────┘    │   │   │
│   │   │                                                                      │   │   │
│   │   │  ┌─────────────────────────────────────────────────────────────┐    │   │   │
│   │   │  │              Recharts (Data Visualization)                   │    │   │   │
│   │   │  └─────────────────────────────────────────────────────────────┘    │   │   │
│   │   │                                                                      │   │   │
│   │   └─────────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                              │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                              │
│                                       │ REST API Calls                               │
│                                       ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                          APPLICATION LAYER                                   │   │
│   │                                                                              │   │
│   │   ┌─────────────────────────────────────────────────────────────────────┐   │   │
│   │   │                   FastAPI Backend (Port 8001)                        │   │   │
│   │   │                                                                      │   │   │
│   │   │   ┌───────────────────┐   ┌───────────────────┐                    │   │   │
│   │   │   │   API Endpoints   │   │   Middleware      │                    │   │   │
│   │   │   │                   │   │                   │                    │   │   │
│   │   │   │  POST /api/predict│   │  - CORS          │                    │   │   │
│   │   │   │  GET /api/predict │   │  - Validation    │                    │   │   │
│   │   │   │  GET /api/stats   │   │  - Logging       │                    │   │   │
│   │   │   │  GET /api/metrics │   │                   │                    │   │   │
│   │   │   │  GET /api/analytics   │                   │                    │   │   │
│   │   │   └───────────────────┘   └───────────────────┘                    │   │   │
│   │   │                                                                      │   │   │
│   │   └─────────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                              │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                              │
│                                       │                                              │
│                    ┌──────────────────┴──────────────────┐                          │
│                    │                                      │                          │
│                    ▼                                      ▼                          │
│   ┌────────────────────────────────┐   ┌────────────────────────────────┐           │
│   │      ML/PROCESSING LAYER       │   │        DATA LAYER              │           │
│   │                                │   │                                │           │
│   │  ┌──────────────────────────┐  │   │  ┌──────────────────────────┐  │           │
│   │  │    Scikit-Learn Models   │  │   │  │    MongoDB Database      │  │           │
│   │  │                          │  │   │  │                          │  │           │
│   │  │  ┌────────────────────┐  │  │   │  │  ┌────────────────────┐  │  │           │
│   │  │  │  RandomForest (81%)│  │  │   │  │  │   predictions      │  │  │           │
│   │  │  └────────────────────┘  │  │   │  │  │   collection       │  │  │           │
│   │  │  ┌────────────────────┐  │  │   │  │  └────────────────────┘  │  │           │
│   │  │  │LogisticReg (81.8%) │  │  │   │  │                          │  │           │
│   │  │  └────────────────────┘  │  │   │  │  ┌────────────────────┐  │  │           │
│   │  │  ┌────────────────────┐  │  │   │  │  │   status_checks    │  │  │           │
│   │  │  │DecisionTree (72%)  │  │  │   │  │  │   collection       │  │  │           │
│   │  │  └────────────────────┘  │  │   │  │  └────────────────────┘  │  │           │
│   │  │  ┌────────────────────┐  │  │   │  │                          │  │           │
│   │  │  │GradBoost (80.6%)   │  │  │   │  └──────────────────────────┘  │           │
│   │  │  └────────────────────┘  │  │   │                                │           │
│   │  │                          │  │   │                                │           │
│   │  └──────────────────────────┘  │   └────────────────────────────────┘           │
│   │                                │                                                 │
│   │  ┌──────────────────────────┐  │                                                 │
│   │  │  Feature Engineering     │  │                                                 │
│   │  │  - Log Transformation    │  │                                                 │
│   │  │  - One-Hot Encoding      │  │                                                 │
│   │  └──────────────────────────┘  │                                                 │
│   │                                │                                                 │
│   └────────────────────────────────┘                                                 │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technologies Used Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 | UI Framework |
| Frontend | Tailwind CSS | Styling |
| Frontend | Shadcn UI | Component Library |
| Frontend | Recharts | Data Visualization |
| Backend | FastAPI | REST API |
| Backend | Python 3.11 | Programming Language |
| ML | Scikit-Learn | Machine Learning Models |
| Database | MongoDB | NoSQL Database |
| ML Models | RandomForest | Primary Prediction (81%) |
| ML Models | LogisticRegression | Alternative (81.8%) |
| ML Models | DecisionTree | Alternative (72%) |
| ML Models | GradientBoosting | Alternative (80.6%) |

---

## How to Render Mermaid Diagrams

1. **GitHub**: Paste in any `.md` file - renders automatically
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Use [mermaid.live](https://mermaid.live/) to render
4. **Export**: Use tools like [mermaid-cli](https://github.com/mermaid-js/mermaid-cli) to export as PNG/SVG
