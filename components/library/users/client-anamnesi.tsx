"use client";

import { updateUser } from "@/app/api/user/updateUser";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Activity,
  Check,
  Dumbbell,
  Edit,
  HeartPulse,
  Save,
  ShieldAlert,
  Target,
  User as UserIcon,
  X,
} from "lucide-react";

type AnamnesiRecapProps = {
  user: any;
  userId: string;
  onSave?: () => void;
};

const AnamnesiRecap = ({ user, userId, onSave }: AnamnesiRecapProps) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ClientDataProps>({
    name: user.name ?? "",
    surname: user.surname ?? "",
    phone: user.phone ?? 0,
    weight: user.weight ?? 0,
    height: user.height ?? 0,
    age: user.age ?? 0,
    sex: user.sex ?? "",
    goal: user.goal ?? "",
    goalReason: user.goalReason ?? "",
    currentlyTraining: user.currentlyTraining ?? "",
    currentTrainingRate: user.currentTrainingRate ?? "",
    currentSport: user.currentSport ?? "",
    personalTraining: user.personalTraining ?? "",
    inactivityPeriod: user.inactivityPeriod ?? "",
    inactivityReason: user.inactivityReason ?? "",
    problems: user.problems ?? "",
    injuries: user.injuries ?? "",
    surgeries: user.surgeries ?? "",
  });

  const handleChange = (value: string | number, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: user.name ?? "",
      surname: user.surname ?? "",
      phone: user.phone ?? 0,
      weight: user.weight ?? 0,
      height: user.height ?? 0,
      age: user.age ?? 0,
      sex: user.sex ?? "",
      goal: user.goal ?? "",
      goalReason: user.goalReason ?? "",
      currentlyTraining: user.currentlyTraining ?? "",
      currentTrainingRate: user.currentTrainingRate ?? "",
      currentSport: user.currentSport ?? "",
      personalTraining: user.personalTraining ?? "",
      inactivityPeriod: user.inactivityPeriod ?? "",
      inactivityReason: user.inactivityReason ?? "",
      problems: user.problems ?? "",
      injuries: user.injuries ?? "",
      surgeries: user.surgeries ?? "",
    });
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(formData, userId);
      setEditing(false);
      onSave?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="text-xs text-neutral-400">
          {editing ? (
            <span className="text-purple-400 font-medium flex items-center gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Modalità modifica attiva
            </span>
          ) : (
            <span>Tutti i dati e i parametri sanitari registrati</span>
          )}
        </div>
        <div>
          {editing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
                className="h-8 px-3 text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border-neutral-700 flex items-center gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Annulla
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="h-8 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Salvataggio..." : "Salva modifiche"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="h-8 px-3 text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700 flex items-center gap-1.5"
            >
              <Edit className="h-3.5 w-3.5" />
              Modifica scheda
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        /* EDITING MODE */
        <div className="space-y-6">
          {/* SECTION 1: ATTIVITÀ FISICA */}
          <div className="p-4 rounded-xl bg-neutral-850/40 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
              <Activity className="h-4 w-4" />
              <span>Abitudini di Allenamento</span>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-neutral-400">
                Attualmente ti stai allenando?
              </Label>
              <RadioGroup
                value={formData.currentlyTraining}
                className="flex items-center gap-4"
                onValueChange={(val) => handleChange(val, "currentlyTraining")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Si" id="training-si" className="border-purple-500 text-purple-500" />
                  <Label htmlFor="training-si" className="text-sm text-neutral-200 cursor-pointer">
                    Sì
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="training-no" className="border-purple-500 text-purple-500" />
                  <Label htmlFor="training-no" className="text-sm text-neutral-200 cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.currentlyTraining === "Si" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Disciplina praticata</Label>
                  <Input
                    value={formData.currentSport ?? ""}
                    placeholder="Es: Sala pesi, Crossfit, Nuoto"
                    className="bg-neutral-800 border-neutral-700 text-white text-sm"
                    onChange={(e) => handleChange(e.target.value, "currentSport")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Frequenza allenamento</Label>
                  <Input
                    value={formData.currentTrainingRate ?? ""}
                    placeholder="Es: 3 volte a settimana"
                    className="bg-neutral-800 border-neutral-700 text-white text-sm"
                    onChange={(e) => handleChange(e.target.value, "currentTrainingRate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-neutral-400">Sedute con Personal Trainer fatte prima?</Label>
                  <RadioGroup
                    value={formData.personalTraining ?? ""}
                    className="flex items-center gap-4 mt-1"
                    onValueChange={(val) => handleChange(val, "personalTraining")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Si" id="pt-si" className="border-purple-500 text-purple-500" />
                      <Label htmlFor="pt-si" className="text-sm text-neutral-200 cursor-pointer">
                        Sì
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="pt-no" className="border-purple-500 text-purple-500" />
                      <Label htmlFor="pt-no" className="text-sm text-neutral-200 cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Da quanto sei inattivo?</Label>
                  <Input
                    value={formData.inactivityPeriod ?? ""}
                    placeholder="Es: 6 mesi, 2 anni"
                    className="bg-neutral-800 border-neutral-700 text-white text-sm"
                    onChange={(e) => handleChange(e.target.value, "inactivityPeriod")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Motivo interruzione</Label>
                  <Input
                    value={formData.inactivityReason ?? ""}
                    placeholder="Es: Lavoro, mancanza di tempo, infortunio"
                    className="bg-neutral-800 border-neutral-700 text-white text-sm"
                    onChange={(e) => handleChange(e.target.value, "inactivityReason")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: OBIETTIVI */}
          <div className="p-4 rounded-xl bg-neutral-850/40 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
              <Target className="h-4 w-4" />
              <span>Obiettivi e Motivazioni</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Obiettivi principali</Label>
                <Textarea
                  value={formData.goal ?? ""}
                  placeholder="Es: Dimagrimento, aumento massa magra, salute generale..."
                  className="bg-neutral-800 border-neutral-700 text-white text-sm min-h-[90px]"
                  onChange={(e) => handleChange(e.target.value, "goal")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Perché perseguire questi obiettivi?</Label>
                <Textarea
                  value={formData.goalReason ?? ""}
                  placeholder="Es: Migliorare benessere fisico e mentale, sentirmi più attivo..."
                  className="bg-neutral-800 border-neutral-700 text-white text-sm min-h-[90px]"
                  onChange={(e) => handleChange(e.target.value, "goalReason")}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SALUTE E CLINICA */}
          <div className="p-4 rounded-xl bg-neutral-850/40 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
              <HeartPulse className="h-4 w-4" />
              <span>Quadro Medico e Infortuni</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Problematiche articolari</Label>
                <Textarea
                  value={formData.problems ?? ""}
                  placeholder="Es: Ernie discali, cervicale, condropatia..."
                  className="bg-neutral-800 border-neutral-700 text-white text-sm min-h-[90px]"
                  onChange={(e) => handleChange(e.target.value, "problems")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Infortuni pregressi</Label>
                <Textarea
                  value={formData.injuries ?? ""}
                  placeholder="Es: Distorsione caviglia destra 2022..."
                  className="bg-neutral-800 border-neutral-700 text-white text-sm min-h-[90px]"
                  onChange={(e) => handleChange(e.target.value, "injuries")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Interventi chirurgici</Label>
                <Textarea
                  value={formData.surgeries ?? ""}
                  placeholder="Es: Menisco ginocchio sx (2020)..."
                  className="bg-neutral-800 border-neutral-700 text-white text-sm min-h-[90px]"
                  onChange={(e) => handleChange(e.target.value, "surgeries")}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: DATI BIOMETRICI */}
          <div className="p-4 rounded-xl bg-neutral-850/40 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
              <UserIcon className="h-4 w-4" />
              <span>Parametri Biometrici e Contatti</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Telefono</Label>
                <Input
                  type="number"
                  value={formData.phone || ""}
                  className="bg-neutral-800 border-neutral-700 text-white text-sm"
                  onChange={(e) => handleChange(Number(e.target.value), "phone")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Età</Label>
                <Input
                  type="number"
                  value={formData.age || ""}
                  className="bg-neutral-800 border-neutral-700 text-white text-sm"
                  onChange={(e) => handleChange(Number(e.target.value), "age")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Altezza (cm)</Label>
                <Input
                  type="number"
                  value={formData.height || ""}
                  className="bg-neutral-800 border-neutral-700 text-white text-sm"
                  onChange={(e) => handleChange(Number(e.target.value), "height")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Peso (kg)</Label>
                <Input
                  type="number"
                  value={formData.weight || ""}
                  className="bg-neutral-800 border-neutral-700 text-white text-sm"
                  onChange={(e) => handleChange(Number(e.target.value), "weight")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Sesso</Label>
                <Input
                  value={formData.sex || ""}
                  placeholder="Es: Uomo / Donna"
                  className="bg-neutral-800 border-neutral-700 text-white text-sm"
                  onChange={(e) => handleChange(e.target.value, "sex")}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* READ-ONLY / DISPLAY MODE */
        <div className="space-y-5">
          {/* SECTION 1: ATTIVITÀ SPORTIVA */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>Attività Fisica e Abitudini</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Attualmente in allenamento</div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      formData.currentlyTraining === "Si"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-neutral-700/40 text-neutral-300 border border-neutral-600"
                    }`}
                  >
                    {formData.currentlyTraining === "Si" ? "Sì, attivo" : "No, inattivo"}
                  </span>
                </div>
              </div>

              {formData.currentlyTraining === "Si" ? (
                <>
                  <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 font-medium">Disciplina</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {formData.currentSport || <span className="text-neutral-500 italic">Non specificata</span>}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 font-medium">Frequenza</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {formData.currentTrainingRate || <span className="text-neutral-500 italic">Non specificata</span>}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 font-medium">Esperienza PT passata</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {formData.personalTraining || <span className="text-neutral-500 italic">-</span>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 font-medium">Periodo di inattività</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {formData.inactivityPeriod || <span className="text-neutral-500 italic">Non specificato</span>}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-850/60 border border-neutral-800 col-span-2">
                    <div className="text-[11px] text-neutral-400 font-medium">Motivo interruzione</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {formData.inactivityReason || <span className="text-neutral-500 italic">Non specificato</span>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 2: OBIETTIVI */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Target className="h-3.5 w-3.5 text-purple-400" />
              <span>Obiettivi e Motivazioni</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Obiettivi principali</div>
                <div className="text-sm font-semibold text-white mt-1 leading-relaxed whitespace-pre-line">
                  {formData.goal || <span className="text-neutral-500 italic font-normal">Nessun obiettivo registrato</span>}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Perché perseguire questi obiettivi?</div>
                <div className="text-sm text-neutral-200 mt-1 leading-relaxed whitespace-pre-line font-medium">
                  {formData.goalReason || <span className="text-neutral-500 italic font-normal">Nessuna motivazione registrata</span>}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SALUTE E ARTICOLARE */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <HeartPulse className="h-3.5 w-3.5 text-purple-400" />
              <span>Quadro Medico, Articolare e Infortuni</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Problematiche articolari</div>
                <div className="text-sm text-neutral-200 mt-1.5 leading-relaxed whitespace-pre-line">
                  {formData.problems || <span className="text-neutral-500 italic">Nessuna problematica registrata</span>}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Infortuni pregressi</div>
                <div className="text-sm text-neutral-200 mt-1.5 leading-relaxed whitespace-pre-line">
                  {formData.injuries || <span className="text-neutral-500 italic">Nessun infortunio registrato</span>}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-850/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">Interventi chirurgici</div>
                <div className="text-sm text-neutral-200 mt-1.5 leading-relaxed whitespace-pre-line">
                  {formData.surgeries || <span className="text-neutral-500 italic">Nessun intervento registrato</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnamnesiRecap;
