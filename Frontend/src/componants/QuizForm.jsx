import react from 'react';
import { Link } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';

export default function QuizForm({initialData , onSubmit}) 
{
    const { register , control ,  handleSubmit , formState : { errors } } = useForm({
        defaultValues:initialData || {
            title:'',
            description:'',
            duration:60,
            questions: [{text:'',options:['','','',''],correctAnswer:0,marks:1}],

        },
    });

    const {fields,append,remove} = useFieldArray({
        control,
        name:'questions',
    });



    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" {...register('title',{required :'Title is required'})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></input>
                
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">errors.title.message</p>

                )}

            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description',{required :'Description is required'})} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">errors.title.message</p>
                    
                )}


            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input type="number" {...register('duration',{required :'Duration is required',min:{value:1,message:'Minimum duration should be 1 min'}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></input>
                
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">errors.title.message</p>
                    
                )}

            </div>

        <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                        Questions
                    </h3>

                    <button type="button" onClick={()=> append({text: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 })}  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"><Plus className="w-4 h-4"></Plus> Add Question</button>
                </div>
            

            
            {fields.map((field,index)=>{
                <div key={field.id} className="p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium">
                            Question{index+1}
                        </h4>
                        <button type="button" onClick={remove(index)} className="text-red-600 hover:text-red-500">
                            <Trash2 className="w-4 h-4"></Trash2>

                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Question Text</label>
                        <textarea {...register(`question.${index+1}.text`,{required:'Question description required'})} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[0,1,2,3].map((optionIndex)=>{
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Option{optionIndex+1}</label>
                                <input {...register(`question.${index}.options.${optionIndex}`,{required:'Option is required'})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></input>

                            </div>
                        })}

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                            <select {...register(`question.${index}.correctAnswer`)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {[0,1,2,3].map((optionIndex)=>{
                                    <option key={optionIndex} value={optionIndex}>
                                        Option{optionIndex+1}
                                    </option>
                                })}

                            </select>


                        </div>

                        <div> 
                            <label className="block text-sm font-medium text-gray-700">Marks</label>
                            <input type="number" {...register(`questions.${index}.marks`,{required:'Marks required',min:{value:1,message:'Minimum marks should be 1'}})}  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></input>
                        </div>

                    </div>
                </div>

            })}
                    
        </div>

            <div className="flex justify-end">
                <button type="submit" className="flex justify-end">{initialData ? 'Update Quiz' : 'Create Quiz'}</button>
            </div>
        
        </form>   
    )
   
}