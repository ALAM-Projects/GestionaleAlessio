"use client";

import { updateUser } from "@/app/api/user/updateUser";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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

  const handleChange = (value: string, name: string) => {
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
    <>
      <div className="flex justify-end mb-2">
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
              Annulla
            </Button>
            <Button variant="brand" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Modifica
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-2 mt-2">
        <div className="col-span-12 items-center gap-1.5 mt-1">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="currentlyTraining"
          >
            Attualmente ti stai allenando?
          </Label>
          <RadioGroup
            value={formData.currentlyTraining}
            disabled={!editing}
            className="flex mt-3"
            id="currentlyTraining"
            name="currentlyTraining"
            onValueChange={(e) => handleChange(e, "currentlyTraining")}
          >
            <div className="flex items-center space-x-2 text-white text-lg">
              <RadioGroupItem
                value="Si"
                id="currentlyTraining-si"
                className="text-white border-white"
              />
              <Label htmlFor="currentlyTraining-si" className="text-md">
                Si
              </Label>
            </div>
            <div className="flex items-center space-x-2 text-white text-lg">
              <RadioGroupItem
                value="No"
                id="currentlyTraining-no"
                className="text-white border-white"
              />
              <Label htmlFor="currentlyTraining-no" className="text-md">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.currentlyTraining === "Si" ? (
          <>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="currentSport"
              >
                In quale disciplina?
              </Label>
              <Textarea
                value={formData.currentSport ?? ""}
                disabled={!editing}
                placeholder="Scrivi quale disciplina stai praticando"
                className="text-md"
                id="currentSport"
                name="currentSport"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="currentTrainingRate"
              >
                Quanto spesso?
              </Label>
              <Textarea
                value={formData.currentTrainingRate ?? ""}
                disabled={!editing}
                placeholder="Eg: 3 volte a settimana, 2 volte al mese"
                className="text-md"
                id="currentTrainingRate"
                name="currentTrainingRate"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </div>
            <div className="col-span-12 items-center gap-1.5 mt-1 mb-3">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="personalTraining"
              >
                Hai mai fatto sedute di PT?
              </Label>
              <RadioGroup
                value={formData.personalTraining ?? ""}
                disabled={!editing}
                className="flex mt-3"
                id="personalTraining"
                name="personalTraining"
                onValueChange={(e) => handleChange(e, "personalTraining")}
              >
                <div className="flex items-center space-x-2 text-white text-lg">
                  <RadioGroupItem
                    value="Si"
                    id="personalTraining-si"
                    className="text-white border-white"
                  />
                  <Label htmlFor="personalTraining-si" className="text-md">
                    Si
                  </Label>
                </div>
                <div className="flex items-center space-x-2 text-white text-lg">
                  <RadioGroupItem
                    value="No"
                    id="personalTraining-no"
                    className="text-white border-white"
                  />
                  <Label htmlFor="personalTraining-no" className="text-md">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        ) : null}

        {formData.currentlyTraining === "No" ? (
          <>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="inactivityPeriod"
              >
                Da quanto sei inattivo?
              </Label>
              <Textarea
                value={formData.inactivityPeriod ?? ""}
                disabled={!editing}
                placeholder="Eg: 3 mesi, 1 anno"
                className="text-md"
                id="inactivityPeriod"
                name="inactivityPeriod"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </div>
            <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-1">
              <Label
                className="text-neutral-400 font-bold text-md"
                htmlFor="inactivityReason"
              >
                Perché hai interrotto?
              </Label>
              <Textarea
                value={formData.inactivityReason ?? ""}
                disabled={!editing}
                placeholder="Scrivi il motivo per cui hai interrotto"
                className="text-md"
                id="inactivityReason"
                name="inactivityReason"
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </div>
          </>
        ) : null}

        <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
          <Label className="text-neutral-400 font-bold text-md" htmlFor="goal">
            Obiettivi
          </Label>
          <Textarea
            value={formData.goal ?? ""}
            placeholder="Eg: Dimagrire, Aumentare la massa muscolare, Maggiore mobilità, Mal di schiena, ecc"
            disabled={!editing}
            className="text-md"
            id="goal"
            name="goal"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="goalReason"
          >
            Perchè perseguire questi obiettivi?
          </Label>
          <Textarea
            value={formData.goalReason ?? ""}
            disabled={!editing}
            className="text-md"
            id="goalReason"
            name="goalReason"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="problems"
          >
            Problematiche a livello articolare
          </Label>
          <Textarea
            value={formData.problems ?? ""}
            disabled={!editing}
            placeholder="Scrivi eventuali problematiche (eg: Ernie, Shiacciamenti, Protusioni, Contropatie, ecc)"
            className="text-md"
            id="problems"
            name="problems"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="injuries"
          >
            Infortuni
          </Label>
          <Textarea
            value={formData.injuries ?? ""}
            disabled={!editing}
            placeholder="Scrivi eventuali infortuni"
            className="text-md"
            id="injuries"
            name="injuries"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
        </div>
        <div className="col-span-12 xl:col-span-3 items-center gap-1.5 mt-2">
          <Label
            className="text-neutral-400 font-bold text-md"
            htmlFor="surgeries"
          >
            Operazioni
          </Label>
          <Textarea
            value={formData.surgeries ?? ""}
            disabled={!editing}
            placeholder="Scrivi eventuali operazioni"
            className="text-md"
            id="surgeries"
            name="surgeries"
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          />
        </div>
      </div>
    </>
  );
};

export default AnamnesiRecap;
