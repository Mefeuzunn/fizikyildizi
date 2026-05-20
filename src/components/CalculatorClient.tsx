"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const LoadingCalculator = () => (
  <div className="animate-pulse" style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "24px", border: "1px dashed var(--border)" }}>
    <div style={{ width: "48px", height: "48px", background: "var(--accent-glow)", borderRadius: "50%", margin: "0 auto 1.5rem" }}></div>
    <div style={{ height: "1.5rem", background: "var(--bg-tertiary)", borderRadius: "4px", width: "200px", margin: "0 auto 1rem" }}></div>
    <div style={{ height: "1rem", background: "var(--bg-tertiary)", borderRadius: "4px", width: "150px", margin: "0 auto" }}></div>
  </div>
);

// Dynamic Imports
const BmiCalculator = dynamic(() => import("@/components/calculators/BmiCalculator").then(m => m.BmiCalculator), { loading: () => <LoadingCalculator /> });
const PregnancyCalculator = dynamic(() => import("@/components/calculators/PregnancyCalculator").then(m => m.PregnancyCalculator), { loading: () => <LoadingCalculator /> });
const CalorieCalculator = dynamic(() => import("@/components/calculators/CalorieCalculator").then(m => m.CalorieCalculator), { loading: () => <LoadingCalculator /> });
const LoanAmortization = dynamic(() => import("@/components/calculators/LoanAmortization").then(m => m.LoanAmortization), { loading: () => <LoadingCalculator /> });
const PercentageCalculator = dynamic(() => import("@/components/calculators/PercentageCalculator").then(m => m.PercentageCalculator), { loading: () => <LoadingCalculator /> });
const CreditCardCalculator = dynamic(() => import("@/components/calculators/CreditCardCalculator").then(m => m.CreditCardCalculator), { loading: () => <LoadingCalculator /> });
const LoanSuite = dynamic(() => import("@/components/calculators/LoanSuite").then(m => m.LoanSuite), { loading: () => <LoadingCalculator /> });
const CreditCardSuite = dynamic(() => import("@/components/calculators/CreditCardSuite").then(m => m.CreditCardSuite), { loading: () => <LoadingCalculator /> });
const BankingAdvanced = dynamic(() => import("@/components/calculators/BankingAdvanced").then(m => m.BankingAdvanced), { loading: () => <LoadingCalculator /> });
const EbobEkokCalculator = dynamic(() => import("@/components/calculators/EbobEkokCalculator").then(m => m.EbobEkokCalculator), { loading: () => <LoadingCalculator /> });
const NetGrossCalculator = dynamic(() => import("@/components/calculators/NetGrossCalculator").then(m => m.NetGrossCalculator), { loading: () => <LoadingCalculator /> });
const InflationCalculator = dynamic(() => import("@/components/calculators/InflationCalculator").then(m => m.InflationCalculator), { loading: () => <LoadingCalculator /> });
const InterestCalculator = dynamic(() => import("@/components/calculators/InterestCalculator").then(m => m.InterestCalculator), { loading: () => <LoadingCalculator /> });
const SeveranceCalculator = dynamic(() => import("@/components/calculators/SeveranceCalculator").then(m => m.SeveranceCalculator), { loading: () => <LoadingCalculator /> });
const BodyFatCalculator = dynamic(() => import("@/components/calculators/BodyFatCalculator").then(m => m.BodyFatCalculator), { loading: () => <LoadingCalculator /> });
const AgssCalculator = dynamic(() => import("@/components/calculators/AgssCalculator").then(m => m.AgssCalculator), { loading: () => <LoadingCalculator /> });
const EurobondCalculator = dynamic(() => import("@/components/calculators/EurobondCalculator").then(m => m.EurobondCalculator), { loading: () => <LoadingCalculator /> });
const GenerationCalculator = dynamic(() => import("@/components/calculators/GenerationCalculator").then(m => m.GenerationCalculator), { loading: () => <LoadingCalculator /> });
const HsyCalculator = dynamic(() => import("@/components/calculators/HsyCalculator").then(m => m.HsyCalculator), { loading: () => <LoadingCalculator /> });
const VehicleExpenseCalculator = dynamic(() => import("@/components/calculators/VehicleExpenseCalculator").then(m => m.VehicleExpenseCalculator), { loading: () => <LoadingCalculator /> });
const PriceCalculator = dynamic(() => import("@/components/calculators/PriceCalculator").then(m => m.PriceCalculator), { loading: () => <LoadingCalculator /> });
const DayOfYearCalculator = dynamic(() => import("@/components/calculators/DayOfYearCalculator").then(m => m.DayOfYearCalculator), { loading: () => <LoadingCalculator /> });
const BmrCalculator = dynamic(() => import("@/components/calculators/BmrCalculator").then(m => m.BmrCalculator), { loading: () => <LoadingCalculator /> });
const MacroCalculator = dynamic(() => import("@/components/calculators/MacroCalculator").then(m => m.MacroCalculator), { loading: () => <LoadingCalculator /> });
const CagrCalculator = dynamic(() => import("@/components/calculators/CagrCalculator").then(m => m.CagrCalculator), { loading: () => <LoadingCalculator /> });
const SavingsCalculator = dynamic(() => import("@/components/calculators/SavingsCalculator").then(m => m.SavingsCalculator), { loading: () => <LoadingCalculator /> });
const BillCalculator = dynamic(() => import("@/components/calculators/BillCalculator").then(m => m.BillCalculator), { loading: () => <LoadingCalculator /> });
const HistoricalGoldCalculator = dynamic(() => import("@/components/calculators/HistoricalGoldCalculator").then(m => m.HistoricalGoldCalculator), { loading: () => <LoadingCalculator /> });
const HistoricalCurrencyCalculator = dynamic(() => import("@/components/calculators/HistoricalCurrencyCalculator").then(m => m.HistoricalCurrencyCalculator), { loading: () => <LoadingCalculator /> });
const DiscountCalculator = dynamic(() => import("@/components/calculators/DiscountCalculator").then(m => m.DiscountCalculator), { loading: () => <LoadingCalculator /> });
const RentIncreaseCalculator = dynamic(() => import("@/components/calculators/RentIncreaseCalculator").then(m => m.RentIncreaseCalculator), { loading: () => <LoadingCalculator /> });
const AverageMaturityCalculator = dynamic(() => import("@/components/calculators/AverageMaturityCalculator").then(m => m.AverageMaturityCalculator), { loading: () => <LoadingCalculator /> });
const TimeValueCalculator = dynamic(() => import("@/components/calculators/TimeValueCalculator").then(m => m.TimeValueCalculator), { loading: () => <LoadingCalculator /> });
const RealReturnCalculator = dynamic(() => import("@/components/calculators/RealReturnCalculator").then(m => m.RealReturnCalculator), { loading: () => <LoadingCalculator /> });
const RepoCalculator = dynamic(() => import("@/components/calculators/RepoCalculator").then(m => m.RepoCalculator), { loading: () => <LoadingCalculator /> });
const DividendCalculator = dynamic(() => import("@/components/calculators/DividendCalculator").then(m => m.DividendCalculator), { loading: () => <LoadingCalculator /> });
const FuturesCalculator = dynamic(() => import("@/components/calculators/FuturesCalculator").then(m => m.FuturesCalculator), { loading: () => <LoadingCalculator /> });
const DepositInterestCalculator = dynamic(() => import("@/components/calculators/DepositInterestCalculator").then(m => m.DepositInterestCalculator), { loading: () => <LoadingCalculator /> });
const LgsCalculator = dynamic(() => import("@/components/calculators/LgsCalculator").then(m => m.LgsCalculator), { loading: () => <LoadingCalculator /> });
const YksCalculator = dynamic(() => import("@/components/calculators/YksCalculator").then(m => m.YksCalculator), { loading: () => <LoadingCalculator /> });
const GradeCalculator = dynamic(() => import("@/components/calculators/GradeCalculator").then(m => m.GradeCalculator), { loading: () => <LoadingCalculator /> });
const DcaCalculator = dynamic(() => import("@/components/calculators/DcaCalculator").then(m => m.DcaCalculator), { loading: () => <LoadingCalculator /> });
const UniversityExamCalculator = dynamic(() => import("@/components/calculators/UniversityExamCalculator").then(m => m.UniversityExamCalculator), { loading: () => <LoadingCalculator /> });
const EOkulCalculator = dynamic(() => import("@/components/calculators/EOkulCalculator").then(m => m.EOkulCalculator), { loading: () => <LoadingCalculator /> });
const LessonGradeCalculator = dynamic(() => import("@/components/calculators/LessonGradeCalculator").then(m => m.LessonGradeCalculator), { loading: () => <LoadingCalculator /> });
const HighSchoolSubjectCalculator = dynamic(() => import("@/components/calculators/HighSchoolSubjectCalculator").then(m => m.HighSchoolSubjectCalculator), { loading: () => <LoadingCalculator /> });
const HighSchoolPassCalculator = dynamic(() => import("@/components/calculators/HighSchoolPassCalculator").then(m => m.HighSchoolPassCalculator), { loading: () => <LoadingCalculator /> });
const HighSchoolGPA = dynamic(() => import("@/components/calculators/HighSchoolGPA").then(m => m.HighSchoolGPA), { loading: () => <LoadingCalculator /> });
const CertificateCalculator = dynamic(() => import("@/components/calculators/CertificateCalculator").then(m => m.CertificateCalculator), { loading: () => <LoadingCalculator /> });
const HighSchoolYBPCalculator = dynamic(() => import("@/components/calculators/HighSchoolYBPCalculator").then(m => m.HighSchoolYBPCalculator), { loading: () => <LoadingCalculator /> });
const HighSchoolGraduationCalculator = dynamic(() => import("@/components/calculators/HighSchoolGraduationCalculator").then(m => m.HighSchoolGraduationCalculator), { loading: () => <LoadingCalculator /> });
const UniversityGPACalculator = dynamic(() => import("@/components/calculators/UniversityGPACalculator").then(m => m.UniversityGPACalculator), { loading: () => <LoadingCalculator /> });
const SchoolAgeCalculator = dynamic(() => import("@/components/calculators/SchoolAgeCalculator").then(m => m.SchoolAgeCalculator), { loading: () => <LoadingCalculator /> });
const DamgaVergisiCalculator = dynamic(() => import("@/components/calculators/TaxCalculators").then(m => m.DamgaVergisiCalculator), { loading: () => <LoadingCalculator /> });
const IncomeTaxCalculator = dynamic(() => import("@/components/calculators/IncomeTaxCalculator").then(m => m.IncomeTaxCalculator), { loading: () => <LoadingCalculator /> });
const VatCalculator = dynamic(() => import("@/components/calculators/VatCalculator").then(m => m.VatCalculator), { loading: () => <LoadingCalculator /> });
const KarZararCalculator = dynamic(() => import("@/components/calculators/CommercialCalculators").then(m => m.KarZararCalculator), { loading: () => <LoadingCalculator /> });
const TopPriceCalculator = dynamic(() => import("@/components/calculators/CommercialCalculators").then(m => m.TopPriceCalculator), { loading: () => <LoadingCalculator /> });
const CommercialAnalytics = dynamic(() => import("@/components/calculators/CommercialAnalytics").then(m => m.CommercialAnalytics), { loading: () => <LoadingCalculator /> });
const BreakEvenCalculator = CommercialAnalytics;
const DateDiffCalculator = GenericCalculator;
const AgeCalculator = GenericCalculator;
const TimeCalculator = GenericCalculator;
const WorkHoursCalculator = GenericCalculator;
const KpssCalculator = dynamic(() => import("@/components/calculators/OsymCalculators").then(m => m.KpssCalculator), { loading: () => <LoadingCalculator /> });
const AlesCalculator = dynamic(() => import("@/components/calculators/OsymCalculators").then(m => m.AlesCalculator), { loading: () => <LoadingCalculator /> });
const DgsCalculator = dynamic(() => import("@/components/calculators/OsymCalculators").then(m => m.DgsCalculator), { loading: () => <LoadingCalculator /> });
const YdsCalculator = dynamic(() => import("@/components/calculators/OsymCalculators").then(m => m.YdsCalculator), { loading: () => <LoadingCalculator /> });
const PeriodCalculator = dynamic(() => import("@/components/calculators/ExtraHealthMiscCalculators").then(m => m.PeriodCalculator), { loading: () => <LoadingCalculator /> });
const ZodiacCalculator = dynamic(() => import("@/components/calculators/ExtraHealthMiscCalculators").then(m => m.ZodiacCalculator), { loading: () => <LoadingCalculator /> });
const FractionsCalculator = dynamic(() => import("@/components/calculators/ExtraMathCalculators").then(m => m.FractionsCalculator), { loading: () => <LoadingCalculator /> });
const LogarithmCalculator = dynamic(() => import("@/components/calculators/ExtraMathCalculators").then(m => m.LogarithmCalculator), { loading: () => <LoadingCalculator /> });
const MatrixCalculator = dynamic(() => import("@/components/calculators/MatrixCalculator").then(m => m.MatrixCalculator), { loading: () => <LoadingCalculator /> });
const EquationSolver = dynamic(() => import("@/components/calculators/EquationSolver").then(m => m.EquationSolver), { loading: () => <LoadingCalculator /> });
const IdealWeightCalculator = dynamic(() => import("@/components/calculators/Phase1Calculators").then(m => m.IdealWeightCalculator), { loading: () => <LoadingCalculator /> });
const PowerRootCalculator = dynamic(() => import("@/components/calculators/Phase1Calculators").then(m => m.PowerRootCalculator), { loading: () => <LoadingCalculator /> });
const PrimeNumberCalculator = dynamic(() => import("@/components/calculators/Phase1Calculators").then(m => m.PrimeNumberCalculator), { loading: () => <LoadingCalculator /> });
const GeometryCalculators = dynamic(() => import("@/components/calculators/GeometryCalculators").then(m => m.GeometryCalculators), { loading: () => <LoadingCalculator /> });
const OhmLawCalculator = dynamic(() => import("@/components/calculators/OhmLawCalculator").then(m => m.OhmLawCalculator), { loading: () => <LoadingCalculator /> });
const PhysicsVisualizers = dynamic(() => import("@/components/calculators/PhysicsVisualizers").then(m => m.PhysicsVisualizers), { loading: () => <LoadingCalculator /> });
const ResistorCalculator = dynamic(() => import("@/components/calculators/ResistorCalculator").then(m => m.ResistorCalculator), { loading: () => <LoadingCalculator /> });
const FuelCostCalculator = dynamic(() => import("@/components/calculators/Phase2Calculators").then(m => m.FuelCostCalculator), { loading: () => <LoadingCalculator /> });
const WaterIntakePremium = dynamic(() => import("@/components/calculators/WaterIntakePremium").then(m => m.WaterIntakePremium), { loading: () => <LoadingCalculator /> });
const SleepCyclePremium = dynamic(() => import("@/components/calculators/SleepCyclePremium").then(m => m.SleepCyclePremium), { loading: () => <LoadingCalculator /> });
const MtvCalculator = dynamic(() => import("@/components/calculators/MtvCalculator").then(m => m.MtvCalculator), { loading: () => <LoadingCalculator /> });
const LengthConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.LengthConverter), { loading: () => <LoadingCalculator /> });
const WeightConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.WeightConverter), { loading: () => <LoadingCalculator /> });
const TempConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.TempConverter), { loading: () => <LoadingCalculator /> });
const AreaConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.AreaConverter), { loading: () => <LoadingCalculator /> });
const VolumeConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.VolumeConverter), { loading: () => <LoadingCalculator /> });
const SpeedConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.SpeedConverter), { loading: () => <LoadingCalculator /> });
const DataConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.DataConverter), { loading: () => <LoadingCalculator /> });
const TimeConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.TimeConverter), { loading: () => <LoadingCalculator /> });
const KitchenConverter = dynamic(() => import("@/components/calculators/Converters").then(m => m.KitchenConverter), { loading: () => <LoadingCalculator /> });
const AofCalculator = dynamic(() => import("@/components/calculators/AofCalculator").then(m => m.AofCalculator), { loading: () => <LoadingCalculator /> });
const TusDusCalculator = dynamic(() => import("@/components/calculators/TusDusCalculator").then(m => m.TusDusCalculator), { loading: () => <LoadingCalculator /> });
const RecipeScaler = dynamic(() => import("@/components/calculators/RecipeScaler").then(m => m.RecipeScaler), { loading: () => <LoadingCalculator /> });
const GastroConverter = dynamic(() => import("@/components/calculators/GastroConverter").then(m => m.GastroConverter), { loading: () => <LoadingCalculator /> });
const ChineseZodiac = dynamic(() => import("@/components/calculators/ChineseZodiac").then(m => m.ChineseZodiac), { loading: () => <LoadingCalculator /> });
const AscendantCalculator = dynamic(() => import("@/components/calculators/AscendantCalculator").then(m => m.AscendantCalculator), { loading: () => <LoadingCalculator /> });
const RaffleMaker = dynamic(() => import("@/components/calculators/RaffleMaker").then(m => m.RaffleMaker), { loading: () => <LoadingCalculator /> });
const RandomNumberGenerator = dynamic(() => import("@/components/calculators/RandomNumberGenerator").then(m => m.RandomNumberGenerator), { loading: () => <LoadingCalculator /> });
const PasswordGenerator = dynamic(() => import("@/components/calculators/PasswordGenerator").then(m => m.PasswordGenerator), { loading: () => <LoadingCalculator /> });
const WordCounter = dynamic(() => import("@/components/calculators/WordCounter").then(m => m.WordCounter), { loading: () => <LoadingCalculator /> });
const QRCodeGenerator = dynamic(() => import("@/components/calculators/QRCodeGenerator").then(m => m.QRCodeGenerator), { loading: () => <LoadingCalculator /> });
const JsonFormatter = dynamic(() => import("@/components/calculators/JsonFormatter").then(m => m.JsonFormatter), { loading: () => <LoadingCalculator /> });
const HashGenerator = dynamic(() => import("@/components/calculators/HashGenerator").then(m => m.HashGenerator), { loading: () => <LoadingCalculator /> });
const ColorConverter = dynamic(() => import("@/components/calculators/ColorConverter").then(m => m.ColorConverter), { loading: () => <LoadingCalculator /> });
const Base64Converter = dynamic(() => import("@/components/calculators/Base64Converter").then(m => m.Base64Converter), { loading: () => <LoadingCalculator /> });
const XCharacterCounter = dynamic(() => import("@/components/calculators/XCharacterCounter").then(m => m.XCharacterCounter), { loading: () => <LoadingCalculator /> });
const StyleTextGenerator = dynamic(() => import("@/components/calculators/StyleTextGenerator").then(m => m.StyleTextGenerator), { loading: () => <LoadingCalculator /> });
const DiceRoller = dynamic(() => import("@/components/calculators/DiceRoller").then(m => m.DiceRoller), { loading: () => <LoadingCalculator /> });
const CoinFlipper = dynamic(() => import("@/components/calculators/CoinFlipper").then(m => m.CoinFlipper), { loading: () => <LoadingCalculator /> });
const MebEkDersCalculator = dynamic(() => import("@/components/calculators/MebEkDersCalculator").then(m => m.MebEkDersCalculator), { loading: () => <LoadingCalculator /> });
const AkademisyenEkDersCalculator = dynamic(() => import("@/components/calculators/AkademisyenEkDersCalculator").then(m => m.AkademisyenEkDersCalculator), { loading: () => <LoadingCalculator /> });
const CurrencyCommodityCalculator = dynamic(() => import("@/components/calculators/CurrencyCommodityCalculator").then(m => m.CurrencyCommodityCalculator), { loading: () => <LoadingCalculator /> });
const TaxFreeCalculator = dynamic(() => import("@/components/calculators/TaxFreeCalculator").then(m => m.TaxFreeCalculator), { loading: () => <LoadingCalculator /> });
const VolumeCalculator = dynamic(() => import("@/components/calculators/VolumeCalculator").then(m => m.VolumeCalculator), { loading: () => <LoadingCalculator /> });
const DesiCalculator = dynamic(() => import("@/components/calculators/DesiCalculator").then(m => m.DesiCalculator), { loading: () => <LoadingCalculator /> });
const IbanValidator = dynamic(() => import("@/components/calculators/IbanValidator").then(m => m.IbanValidator), { loading: () => <LoadingCalculator /> });
const BondCalculator = dynamic(() => import("@/components/calculators/BondCalculator").then(m => m.BondCalculator), { loading: () => <LoadingCalculator /> });
const IrrNpvCalculator = dynamic(() => import("@/components/calculators/IrrNpvCalculator").then(m => m.IrrNpvCalculator), { loading: () => <LoadingCalculator /> });
const BtuCalculator = dynamic(() => import("@/components/calculators/BtuCalculator").then(m => m.BtuCalculator), { loading: () => <LoadingCalculator /> });
const MotorPowerCalculator = dynamic(() => import("@/components/calculators/MotorPowerCalculator").then(m => m.MotorPowerCalculator), { loading: () => <LoadingCalculator /> });
const SteelWeightCalculator = dynamic(() => import("@/components/calculators/SteelWeightCalculator").then(m => m.SteelWeightCalculator), { loading: () => <LoadingCalculator /> });
const KineticEnergyCalculator = dynamic(() => import("@/components/calculators/KineticEnergyCalculator").then(m => m.KineticEnergyCalculator), { loading: () => <LoadingCalculator /> });
const FluidPressureCalculator = dynamic(() => import("@/components/calculators/FluidPressureCalculator").then(m => m.FluidPressureCalculator), { loading: () => <LoadingCalculator /> });
const StatisticsCalculator = dynamic(() => import("@/components/calculators/StatisticsCalculator").then(m => m.StatisticsCalculator), { loading: () => <LoadingCalculator /> });
const PermutationCombinationCalculator = dynamic(() => import("@/components/calculators/PermutationCombinationCalculator").then(m => m.PermutationCombinationCalculator), { loading: () => <LoadingCalculator /> });

// Matematik Araçları (MathTools.tsx)
const GoldenRatioCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.GoldenRatioCalculator), { loading: () => <LoadingCalculator /> });
const FactorialCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.FactorialCalculator), { loading: () => <LoadingCalculator /> });
const SquareMeterCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.SquareMeterCalculator), { loading: () => <LoadingCalculator /> });
const RatioCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.RatioCalculator), { loading: () => <LoadingCalculator /> });
const NumberToWordsCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.NumberToWordsCalculator), { loading: () => <LoadingCalculator /> });
const BaseConverter = dynamic(() => import("@/components/calculators/MathTools").then(m => m.BaseConverter), { loading: () => <LoadingCalculator /> });
const SimpleInterestMath = dynamic(() => import("@/components/calculators/MathTools").then(m => m.SimpleInterestMath), { loading: () => <LoadingCalculator /> });
const CompoundInterestMath = dynamic(() => import("@/components/calculators/MathTools").then(m => m.CompoundInterestMath), { loading: () => <LoadingCalculator /> });
const PerimeterCalculator = dynamic(() => import("@/components/calculators/MathTools").then(m => m.PerimeterCalculator), { loading: () => <LoadingCalculator /> });
const InchConverter = dynamic(() => import("@/components/calculators/MathTools").then(m => m.InchConverter), { loading: () => <LoadingCalculator /> });
const MileConverter = dynamic(() => import("@/components/calculators/MathTools").then(m => m.MileConverter), { loading: () => <LoadingCalculator /> });

// Sınav Hesaplama Araçları (Birleştirilmiş)
const AksCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.AksCalculator), { loading: () => <LoadingCalculator /> });
const EhliyetCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.EhliyetCalculator), { loading: () => <LoadingCalculator /> });
const IsgCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.IsgCalculator), { loading: () => <LoadingCalculator /> });
const OzelGuvenlikCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.OzelGuvenlikCalculator), { loading: () => <LoadingCalculator /> });
const MsuCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.MsuCalculator), { loading: () => <LoadingCalculator /> });
const PoliceCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.PoliceCalculator), { loading: () => <LoadingCalculator /> });
const EkpssCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.EkpssCalculator), { loading: () => <LoadingCalculator /> });
const HmgsCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.HmgsCalculator), { loading: () => <LoadingCalculator /> });
const ObpCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.ObpCalculator), { loading: () => <LoadingCalculator /> });
const DibMbstsCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.DibMbstsCalculator), { loading: () => <LoadingCalculator /> });
const EusCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.EusCalculator), { loading: () => <LoadingCalculator /> });
const IyosCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.IyosCalculator), { loading: () => <LoadingCalculator /> });
const OypCalculator = dynamic(() => import("@/components/calculators/ExamCalculators").then(m => m.OypCalculator), { loading: () => <LoadingCalculator /> });

// Yeni Araçlar ve Oyunlar
const Game2048 = dynamic(() => import("@/components/games/Game2048").then(m => m.Game2048), { loading: () => <LoadingCalculator /> });
const Sudoku = dynamic(() => import("@/components/games/Sudoku").then(m => m.Sudoku), { loading: () => <LoadingCalculator /> });
const PdfMerge = dynamic(() => import("@/components/calculators/PdfMerge").then(m => m.PdfMerge), { loading: () => <LoadingCalculator /> });
const PdfSplit = dynamic(() => import("@/components/calculators/PdfSplit").then(m => m.PdfSplit), { loading: () => <LoadingCalculator /> });
const ImageToPdf = dynamic(() => import("@/components/calculators/ImageToPdf").then(m => m.ImageToPdf), { loading: () => <LoadingCalculator /> });
const PdfCompress = dynamic(() => import("@/components/calculators/PdfCompress").then(m => m.PdfCompress), { loading: () => <LoadingCalculator /> });
const PdfToImage = dynamic(() => import("@/components/calculators/PdfToImage").then(m => m.PdfToImage), { loading: () => <LoadingCalculator /> });
const RetirementCalculator = dynamic(() => import("@/components/calculators/RetirementCalculator").then(m => m.RetirementCalculator), { loading: () => <LoadingCalculator /> });
const InvestmentSimulator = dynamic(() => import("@/components/calculators/InvestmentSimulator").then(m => m.InvestmentSimulator), { loading: () => <LoadingCalculator /> });
const CarbonFootprintCalculator = dynamic(() => import("@/components/calculators/CarbonFootprintCalculator").then(m => m.CarbonFootprintCalculator), { loading: () => <LoadingCalculator /> });
const GlassGenerator = dynamic(() => import("@/components/calculators/GlassGenerator").then(m => m.GlassGenerator), { loading: () => <LoadingCalculator /> });
const AiPromptOptimizer = dynamic(() => import("@/components/calculators/AiPromptOptimizer").then(m => m.AiPromptOptimizer), { loading: () => <LoadingCalculator /> });
const JwtDebugger = dynamic(() => import("@/components/calculators/JwtDebugger").then(m => m.JwtDebugger), { loading: () => <LoadingCalculator /> });
const CronVisualizer = dynamic(() => import("@/components/calculators/CronVisualizer").then(m => m.CronVisualizer), { loading: () => <LoadingCalculator /> });
const StockAverageCalculator = dynamic(() => import("@/components/calculators/StockAverageCalculator").then(m => m.StockAverageCalculator), { loading: () => <LoadingCalculator /> });

// Sağlık Araçları (HealthCalculators.tsx)
const VaccinationCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.VaccinationCalculator), { loading: () => <LoadingCalculator /> });
const BabyGrowthCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.BabyGrowthCalculator), { loading: () => <LoadingCalculator /> });
const WaistHipCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.WaistHipCalculator), { loading: () => <LoadingCalculator /> });
const DueDateCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.DueDateCalculator), { loading: () => <LoadingCalculator /> });
const NutrientCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.NutrientCalculator), { loading: () => <LoadingCalculator /> });
const SmokingCostCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.SmokingCostCalculator), { loading: () => <LoadingCalculator /> });
const BraSizeCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.BraSizeCalculator), { loading: () => <LoadingCalculator /> });
const LifeExpectancyCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.LifeExpectancyCalculator), { loading: () => <LoadingCalculator /> });
const OvulationCalculator = dynamic(() => import("@/components/calculators/HealthCalculators").then(m => m.OvulationCalculator), { loading: () => <LoadingCalculator /> });

function GenericCalculator() {
  return (
    <div className="animate-fade-in" style={{ textAlign: "center", padding: "4rem 2rem", background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed var(--border)' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
        <div className="animate-pulse" style={{ position: 'absolute', inset: 0, background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative' }}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path>
        </svg>
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>Başarıyla Geliştiriliyor</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto" }}>
        Bu modül şu an 2026 standartlarına uygun şekilde optimize ediliyor. Çok yakında tam kapasite ile yayında olacak.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {[1, 2, 3].map(i => <div key={i} className="animate-bounce" style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', animationDelay: `${i * 0.2}s` }}></div>)}
      </div>
    </div>
  );
}

interface CalculatorWidgetProps {
  slug: string;
}

export function CalculatorWidget({ slug }: CalculatorWidgetProps) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recent_calculators") || "[]");
      const filtered = stored.filter((s: string) => s !== slug);
      filtered.unshift(slug);
      localStorage.setItem("recent_calculators", JSON.stringify(filtered.slice(0, 4)));
    } catch (e) {
      // ignore errors
    }
  }, [slug]);

  const renderCalculator = () => {
    switch (slug) {
      case "vucut-kitle-endeksi": return <BmiCalculator />;
      case "gebelik": return <PregnancyCalculator />;
      case "vucut-yag-orani": return <BodyFatCalculator />;
      case "adet-takibi": return <PeriodCalculator />;
      case "ideal-kilo": return <IdealWeightCalculator />;
      case "su-ihtiyaci":
      case "su-takibi": return <WaterIntakePremium />;
      case "uyku-dongusu": return <SleepCyclePremium />;
      case "makro-hesaplama": return <MacroCalculator />;
      case "bmr": return <BmrCalculator />;
      case "gunluk-kalori-ihtiyaci": return <CalorieCalculator />;

      // Yeni Sağlık Araçları
      case "asi-takvimi": return <VaccinationCalculator />;
      case "bebek-gelisimi": return <BabyGrowthCalculator />;
      case "bel-kalca-orani": return <WaistHipCalculator />;
      case "dogum-tarihi": return <DueDateCalculator />;
      case "protein-ihtiyaci": return <NutrientCalculator type="protein" />;
      case "karbonhidrat-ihtiyaci": return <NutrientCalculator type="carb" />;
      case "yag-ihtiyaci": return <NutrientCalculator type="fat" />;
      case "kreatin-dozu": return <NutrientCalculator type="creatine" />;
      case "sigara-maliyeti": return <SmokingCostCalculator />;
      case "sutyen-bedeni": return <BraSizeCalculator />;
      case "yasam-suresi": return <LifeExpectancyCalculator />;
      case "yumurtlama-donemi": return <OvulationCalculator />;
      case "kredi-hesaplama":
      case "ihtiyac-kredisi":
      case "konut-kredisi":
      case "tasit-kredisi":
      case "ticari-kredi":
      case "is-yeri-kredisi":
      case "ticari-arac-kredisi":
      case "ticari-ihtiyac-kredisi": return <LoanSuite />;

      case "kredi-odeme-plani": return <LoanAmortization />;

      case "kredi-karti-asgari":
      case "kredi-karti-ek-taksit":
      case "kredi-karti-taksitli-nakit-avans":
      case "kredi-karti-gecikme-faizi":
      case "kredi-karti-islem-taksitlendirme": return <CreditCardSuite />;

      case "ne-kadar-kredi-alabilirim":
      case "kredi-erken-kapatma":
      case "kredi-dosya-masrafi":
      case "kredi-gecikme-faizi":
      case "kredi-yillik-maliyet-orani":
      case "kredi-yapilandirma": return <BankingAdvanced />;

      case "faiz": return <InterestCalculator />;
      case "enflasyon": return <InflationCalculator />;
      case "yuzde": return <PercentageCalculator />;
      case "ebob-ekok": return <EbobEkokCalculator />;
      case "kesir-hesaplama": return <FractionsCalculator />;
      case "matris-hesaplama": return <MatrixCalculator />;
      case "denklem-cozucu": return <EquationSolver />;
      case "logaritma": return <LogarithmCalculator />;
      case "alan-hacim": return <GeometryCalculators />;
      case "uslu-koklu": return <PowerRootCalculator />;
      case "denklem-eski": return <EquationSolver />;
      case "asal-sayi": return <PrimeNumberCalculator />;
      case "altin-oran": return <GoldenRatioCalculator />;
      case "faktoriyel-hesaplama": return <FactorialCalculator />;
      case "metrekare-hesaplama": return <SquareMeterCalculator />;
      case "oran-oranti-hesaplama": return <RatioCalculator />;
      case "sayi-okunusu": return <NumberToWordsCalculator />;
      case "taban-donusumu": return <BaseConverter />;
      case "basit-faiz": return <SimpleInterestMath />;
      case "bilesik-faiz": return <CompoundInterestMath />;
      case "cevre-hesaplama": return <PerimeterCalculator />;
      case "inc-hesaplama": return <InchConverter />;
      case "mil-hesaplama": return <MileConverter />;

      // Sınavlar
      case "aks-puan-hesaplama": return <AksCalculator />;
      case "ehliyet-sinavi-puan": return <EhliyetCalculator />;
      case "isg-puan-hesaplama": return <IsgCalculator />;
      case "ozel-guvenlik-sinavi-puan": return <OzelGuvenlikCalculator />;
      case "msu-puan-hesaplama": return <MsuCalculator />;
      case "polislik-puan-hesaplama": return <PoliceCalculator />;
      case "ekpss-puan-hesaplama": return <EkpssCalculator />;
      case "hmgs-puan-hesaplama": return <HmgsCalculator />;
      case "obp-hesaplama": return <ObpCalculator />;
      case "dib-mbsts-puan": return <DibMbstsCalculator />;
      case "eus-puan": return <EusCalculator />;
      case "iyos-puan": return <IyosCalculator />;
      case "oyp-puan": return <OypCalculator />;

      case "netten-brute": return <NetGrossCalculator />;
      case "kidem-tazminati": return <SeveranceCalculator />;
      case "meb-ek-ders-hesaplama": return <MebEkDersCalculator />;
      case "akademisyen-ek-ders-hesaplama": return <AkademisyenEkDersCalculator />;
      case "yakit-maliyeti": return <FuelCostCalculator />;
      case "mtv-hesaplama": return <MtvCalculator />;
      case "tax-free-hesaplama": return <TaxFreeCalculator />;
      case "doviz-altin-hesaplama": return <CurrencyCommodityCalculator />;
      case "kargo-desi-hesaplama": return <DesiCalculator />;
      case "litre-cl-ml-hesaplama": return <VolumeCalculator />;
      case "ags-puan": return <AgssCalculator />;
      case "eurobond": return <EurobondCalculator />;
      case "kusak": return <GenerationCalculator />;
      case "hakim-savci-puan": return <HsyCalculator />;
      case "binek-arac-gider": return <VehicleExpenseCalculator />;
      case "fiyat": return <PriceCalculator />;
      case "yilin-kacinci-gunu": return <DayOfYearCalculator />;
      case "net-bugunku-deger": return <IrrNpvCalculator />;
      case "bilesik-buyume": return <CagrCalculator />;
      case "birikim": return <SavingsCalculator />;
      case "bono": return <BillCalculator />;
      case "tahvil": return <BondCalculator />;
      case "gecmis-altin": return <HistoricalGoldCalculator />;
      case "gecmis-doviz": return <HistoricalCurrencyCalculator />;
      case "iban": return <IbanValidator />;
      case "iskonto": return <DiscountCalculator />;
      case "ic-verim-orani": return <IrrNpvCalculator />;
      case "kira-artisi": return <RentIncreaseCalculator />;
      case "ortalama-vade": return <AverageMaturityCalculator />;
      case "parasal-deger": return <TimeValueCalculator />;
      case "reel-getiri": return <RealReturnCalculator />;
      case "repo": return <RepoCalculator />;
      case "temettu": return <DividendCalculator />;
      case "vadeli-islem": return <FuturesCalculator />;
      case "vadeli-mevduat": return <DepositInterestCalculator />;
      case "dolar-maliyet-ortalamasi": return <DcaCalculator />;
      case "hisse-senedi-ortalama-maliyet": return <StockAverageCalculator />;
      case "kpss-puan": return <KpssCalculator />;
      case "ales-puan": return <AlesCalculator />;
      case "dgs-puan": return <DgsCalculator />;
      case "yds-puan": return <YdsCalculator />;
      case "tus-dus-puan": return <TusDusCalculator />;
      case "tarif-olcekleyici": return <RecipeScaler />;
      case "mutfak-donusturucu": return <GastroConverter />;
      case "egik-atish": return <PhysicsVisualizers />;
      case "aof-harf-notu": return <AofCalculator />;
      case "lgs-puan": return <LgsCalculator />;
      case "yks-puan": return <YksCalculator />;
      case "not-ortalamasi": return <GradeCalculator />;
      case "vize-final-ortalama": return <UniversityExamCalculator />;
      case "e-okul-not": return <EOkulCalculator />;
      case "ders-notu-hesaplama": return <LessonGradeCalculator />;
      case "lise-ders-puani": return <HighSchoolSubjectCalculator />;
      case "lise-sinif-gecme": return <HighSchoolPassCalculator />;
      case "lise-ortalama": return <HighSchoolGPA />;
      case "takdir-tesekkur": return <CertificateCalculator />;
      case "lise-ybp": return <HighSchoolYBPCalculator />;
      case "lise-mezuniyet": return <HighSchoolGraduationCalculator />;
      case "universite-not-ortalamasi": return <UniversityGPACalculator />;
      case "okula-baslama-yasi": return <SchoolAgeCalculator />;
      case "kdv": return <VatCalculator />;
      case "direnc-hesaplama": return <ResistorCalculator />;
      case "ohm-kanunu": return <OhmLawCalculator />;
      case "gelir-vergisi": return <IncomeTaxCalculator />;
      case "damga-vergisi": return <DamgaVergisiCalculator />;
      case "kar-marji": return <CommercialAnalytics />;
      case "kar-zarar": return <KarZararCalculator />;
      case "toptan-perakende": return <TopPriceCalculator />;
      case "basabas-noktasi": return <BreakEvenCalculator />;
      case "tarihler-arasi-gun": return <DateDiffCalculator />;
      case "yas-hesaplama": return <AgeCalculator />;
      case "saat-hesaplama": return <TimeCalculator />;
      case "calisma-saati": return <WorkHoursCalculator />;
      case "burc-hesaplama": return <ZodiacCalculator />;
      case "cin-burcu": return <ChineseZodiac />;
      case "yukselen-burc": return <AscendantCalculator />;
      case "uzunluk-cevirici": return <LengthConverter />;
      case "agirlik-cevirici": return <WeightConverter />;
      case "sicaklik-cevirici": return <TempConverter />;
      case "alan-cevirici": return <AreaConverter />;
      case "hacim-cevirici": return <VolumeConverter />;
      case "hiz-cevirici": return <SpeedConverter />;
      case "veri-cevirici": return <DataConverter />;
      case "zaman-cevirici": return <TimeConverter />;
      case "twitter-karakter-sayaci": return <XCharacterCounter />;
      case "sik-yazi-tipi-olusturucu": return <StyleTextGenerator />;
      case "sifre-olusturucu": return <PasswordGenerator />;
      case "kelime-sayaci": return <WordCounter />;
      case "qr-kod-olusturucu": return <QRCodeGenerator />;
      case "cekilis-yapici": return <RaffleMaker />;
      case "zar-atma": return <DiceRoller />;
      case "yazi-tura": return <CoinFlipper />;
      case "rastgele-sayi": return <RandomNumberGenerator />;
      case "json-formatter": return <JsonFormatter />;
      case "hash-generator": return <HashGenerator />;
      case "base64-converter": return <Base64Converter />;
      case "renk-donusturucu": return <ColorConverter />;
      case "btu-hesaplama": return <BtuCalculator />;
      case "motor-gucu-hesaplama": return <MotorPowerCalculator />;
      case "metal-agirlik-hesaplama": return <SteelWeightCalculator />;
      case "kinetik-enerji-hesaplama": return <KineticEnergyCalculator />;
      case "sivi-basinci-hesaplama": return <FluidPressureCalculator />;
      case "istatistik-hesaplama": return <StatisticsCalculator />;
      case "permutasyon-kombinasyon-hesaplama": return <PermutationCombinationCalculator />;

      // PDF Araçları
      case "pdf-birlestir": return <PdfMerge />;
      case "pdf-bolme": return <PdfSplit />;
      case "image-to-pdf": return <ImageToPdf />;
      case "pdf-sikistir": return <PdfCompress />;
      case "pdf-to-image": return <PdfToImage />;
      case "ne-zaman-emekli-olurum": return <RetirementCalculator />;
      case "yatirim-simulatoru": return <InvestmentSimulator />;
      case "karbon-ayak-izi": return <CarbonFootprintCalculator />;

      // Geliştirici & Tasarımcı
      case "glassmorphism-generator": return <GlassGenerator />;
      case "ai-prompt-optimizer": return <AiPromptOptimizer />;
      case "jwt-debugger": return <JwtDebugger />;
      case "cron-visualizer": return <CronVisualizer />;

      // Oyunlar
      case "2048": return <Game2048 />;
      case "sudoku": return <Sudoku />;

      default: return <GenericCalculator />;
    }
  };

  return (
    <div>{renderCalculator()}</div>
  );
}

